import { createFileRoute } from "@tanstack/react-router"
import http from "node:http"
import https from "node:https"

const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app"

function fetchRemoteImage(
  targetUrl: string,
  authorization?: string
): Promise<{ status: number; headers: Record<string, string>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl)
    const transport = parsed.protocol === "https:" ? https : http

    const req = transport.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        path: `${parsed.pathname}${parsed.search}`,
        method: "GET",
        headers: {
          Accept: "image/*,*/*",
          ...(authorization ? { Authorization: authorization } : {}),
        },
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on("data", (chunk: Buffer) => chunks.push(chunk))
        res.on("end", () => {
          const headers: Record<string, string> = {}
          for (const [key, value] of Object.entries(res.headers)) {
            if (typeof value === "string") headers[key] = value
          }
          resolve({
            status: res.statusCode ?? 500,
            headers,
            body: Buffer.concat(chunks),
          })
        })
      }
    )

    req.on("error", reject)
    req.end()
  })
}

function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false
    return parsed.hostname === "pub-placeholder.r2.dev" || parsed.hostname.endsWith(".r2.dev")
  } catch {
    return false
  }
}

export const Route = createFileRoute("/api/files/$fileId/preview")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const fileId = Number(params.fileId)
        if (!Number.isFinite(fileId) || fileId <= 0) {
          return new Response(JSON.stringify({ message: "Invalid file id", success: false }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          })
        }

        const { searchParams } = new URL(request.url)
        const remoteUrl = searchParams.get("url")?.trim() ?? ""

        if (!remoteUrl || !isAllowedImageUrl(remoteUrl)) {
          return new Response(JSON.stringify({ message: "Invalid image url", success: false }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          })
        }

        const authorization = request.headers.get("authorization") ?? undefined

        const upstreamCandidates = [
          remoteUrl,
          `${API_BASE_URL.replace(/\/$/, "")}/uploads/${fileId}`,
          `${API_BASE_URL.replace(/\/$/, "")}/uploads/${fileId}/download`,
          `${API_BASE_URL.replace(/\/$/, "")}/files/${fileId}`,
        ]

        try {
          let success: { headers: Record<string, string>; body: Buffer } | null = null

          for (const candidate of upstreamCandidates) {
            const { status, headers, body } = await fetchRemoteImage(candidate, authorization)
            if (status >= 200 && status < 300 && body.length > 0) {
              const contentType = headers["content-type"] ?? ""
              if (contentType.includes("image") || !contentType.includes("json")) {
                success = { headers, body }
                break
              }
            }
          }

          if (!success) {
            const last = await fetchRemoteImage(remoteUrl, authorization)
            return new Response(last.body, {
              status: last.status,
              headers: { "Content-Type": last.headers["content-type"] ?? "application/json" },
            })
          }

          return new Response(success.body, {
            status: 200,
            headers: {
              "Content-Type": success.headers["content-type"] ?? "image/jpeg",
              "Cache-Control": "private, max-age=300",
            },
          })
        } catch {
          return new Response(JSON.stringify({ message: "Failed to load image", success: false }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          })
        }
      },
    },
  },
})
