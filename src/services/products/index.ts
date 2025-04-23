import { ErrorResponse, Pagination } from '../../types/index.ts'
import { httpClient } from '../http-client.ts'
import { AxiosRequestConfig } from 'axios'

interface ProductRequest {
  page_token?: string
  page_size: number
  sort_by?: string
  direction_by?: string
  type?: string
  search?: string
  exclude_product_ids?: number[]
}

type TotalByType = {
  all: number
  with_review: number
  no_review: number
}

export interface Product {
  id: string
  shop_id: number
  product_id: number
  title: string
  handle: string
  status: boolean
  image: string
  type: string
  price: number
  last_imported_at: string
  average_rating: number
  total_reviews: number
  total_reviews_published: number
  created_at: string
  updated_at: string
  flat_cache_imported: number
  status_imported: string
  start_import_at: string
  end_import_at: string
  product_url: string
  hash: string
}

interface ProductResponse {
  errors?: ErrorResponse[]
  products?: Product[]
  pagination?: Pagination
  total_product?: TotalByType
  has_product_by_store: boolean
  total_products: number
}

export const getProducts = async (params: ProductRequest): Promise<ProductResponse> => {
  const response = await httpClient.get<AxiosRequestConfig, ProductResponse>('/product/list', { params })
  return response
}
