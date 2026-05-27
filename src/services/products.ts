import { productsApi } from "@/api/products"
import type {
  CreateProductRequest,
  ProductRecord,
  ProductsListParams,
  UpdateProductRequest,
} from "@/api/product-types"

export const productsService = {
  list(params?: ProductsListParams) {
    return productsApi.list(params)
  },

  getById(id: number): Promise<ProductRecord> {
    return productsApi.getById(id)
  },

  create(data: CreateProductRequest) {
    return productsApi.create(data)
  },

  update(id: number, data: UpdateProductRequest) {
    return productsApi.update(id, data)
  },

  remove(id: number) {
    return productsApi.remove(id)
  },

  approve(id: number) {
    return productsApi.approve(id)
  },

  reject(id: number, reason?: string) {
    return productsApi.reject(id, reason)
  },
}
