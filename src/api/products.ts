import { portalApiClient } from "@/api/portal-api-client"
import type {
  CreateProductRequest,
  ProductRecord,
  ProductResponse,
  ProductsListParams,
  ProductsListResponse,
  UpdateProductRequest,
} from "@/api/product-types"
import type { ApiResponse } from "@/api/types"
import { getPortalAuthHeaders, getPortalAuthorizationHeader } from "@/lib/portal-auth"
import { extractProductRecord } from "@/lib/products-api-response"
import { ApiError } from "@/api/types"

const PRODUCTS_BASE = "/products"

function assertPortalAuth(): void {
  if (!getPortalAuthorizationHeader()) {
    throw new ApiError(401, "You are not signed in. Please log in again.", {
      message: "Unauthorized",
      success: false,
    })
  }
}

export const productsApi = {
  list(params: ProductsListParams = {}): Promise<ProductsListResponse> {
    return portalApiClient
      .get<ProductsListResponse>(PRODUCTS_BASE, {
        params,
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  getById(id: number): Promise<ProductRecord> {
    if (!Number.isFinite(id) || id <= 0) {
      return Promise.reject(
        new ApiError(400, "Invalid product ID.", { message: "Invalid product ID", success: false })
      )
    }

    return portalApiClient
      .get(`${PRODUCTS_BASE}/${id}`, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => {
        const record = extractProductRecord(res.data)
        if (!record) {
          throw new ApiError(404, "Product not found.", {
            message: "Product not found",
            success: false,
          })
        }
        return record
      })
  },

  create(data: CreateProductRequest): Promise<ProductResponse> {
    assertPortalAuth()
    return portalApiClient
      .post<ProductResponse>(`${PRODUCTS_BASE}/create`, data, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  update(id: number, data: UpdateProductRequest): Promise<ProductResponse> {
    assertPortalAuth()
    return portalApiClient
      .patch<ProductResponse>(`${PRODUCTS_BASE}/${id}`, data, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  remove(id: number): Promise<ApiResponse> {
    assertPortalAuth()
    return portalApiClient
      .delete<ApiResponse>(`${PRODUCTS_BASE}/${id}`, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  approve(id: number): Promise<ProductResponse> {
    assertPortalAuth()
    return portalApiClient
      .patch<ProductResponse>(`${PRODUCTS_BASE}/${id}/approve`, undefined, {
        headers: getPortalAuthHeaders(),
      })
      .then((res) => res.data)
  },

  reject(id: number, reason?: string): Promise<ProductResponse> {
    assertPortalAuth()
    return portalApiClient
      .patch<ProductResponse>(
        `${PRODUCTS_BASE}/${id}/reject`,
        reason ? { reason } : undefined,
        { headers: getPortalAuthHeaders() }
      )
      .then((res) => res.data)
  },
}
