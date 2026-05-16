import { createFileRoute } from "@tanstack/react-router"
import http from "node:http"
import https from "node:https"

const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app"

function proxyUserProfile(
  userId: string,
  authorization?: string
): Promise<{ status: number; raw: string }> {
  return new Promise((resolve, reject) => {
    const base = API_BASE_URL.replace(/\/$/, "")
    const parsed = new URL(`/user/profile?user_id=${encodeURIComponent(userId)}`, base)
    const transport = parsed.protocol === "https:" ? https : http

    const req = transport.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        path: `${parsed.pathname}${parsed.search}`,
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
      },
      (res) => {
        let raw = ""
        res.setEncoding("utf8")
        res.on("data", (chunk) => {
          raw += chunk
        })
        res.on("end", () => {
          resolve({ status: res.statusCode ?? 500, raw })
        })
      }
    )

    req.on("error", reject)
    req.end()
  })
}

export const Route = createFileRoute("/api/user/profile")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("user_id")

        if (!userId) {
          return new Response(
            JSON.stringify({ message: "user_id is required", success: false }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          )
        }

        const authorization = request.headers.get("authorization") ?? undefined
        const { status, raw } = await proxyUserProfile(userId, authorization)

        return new Response(raw, {
          status,
          headers: { "Content-Type": "application/json" },
        })
      },
    },
  },
})
