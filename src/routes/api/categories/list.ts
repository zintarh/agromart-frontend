import { createFileRoute } from "@tanstack/react-router"
import http from "node:http"
import https from "node:https"

const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "https://agromart-production.up.railway.app"

function proxyCategoriesList(
  body: { page: number; limit: number; sort_order: string },
  authorization?: string
): Promise<{ status: number; raw: string }> {
  return new Promise((resolve, reject) => {
    const base = API_BASE_URL.replace(/\/$/, "")
    const parsed = new URL("/categories", base)
    const payload = JSON.stringify(body)
    const transport = parsed.protocol === "https:" ? https : http

    const req = transport.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        path: parsed.pathname,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(payload),
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
    req.write(payload)
    req.end()
  })
}

export const Route = createFileRoute("/api/categories/list")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)

        const body = {
          page: Number(searchParams.get("page")) || 1,
          limit: Number(searchParams.get("limit")) || 10,
          sort_order: searchParams.get("sort_order") || "desc",
        }

        const authorization = request.headers.get("authorization") ?? undefined
        const { status, raw } = await proxyCategoriesList(body, authorization)

        return new Response(raw, {
          status,
          headers: { "Content-Type": "application/json" },
        })
      },
    },
  },
})
