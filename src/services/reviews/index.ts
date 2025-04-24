import { AxiosRequestConfig } from 'axios'
import { ErrorResponse } from '../../types/index.ts'
import { httpClient } from '../http-client.ts'

export interface Review {
  product_id?: number
  amazon_id?: string
  aliexpress_id?: string
  avatar?: string
  author: string
  star: number
  country: string
  content?: string
  content_translate?: string
  img?: string[]
  source: string
  status: boolean
  approve: boolean
  imported_at?: string
  created_at: string
  updated_at?: string
}

export interface SaveReviewsRequest {
  reviews: Review[]
  job_import_id: string
  product_id: number
  external_id: string
  page: number
  platform: string
  language_code?: string
}

export interface SaveReviewsResponse {
  errors?: ErrorResponse[]
  total_duplicated_by_request: number
  total_collect_by_request: number
  is_accept_review: boolean
}

export const saveReviews = async (data: SaveReviewsRequest): Promise<SaveReviewsResponse> => {
  const response = await httpClient.post<AxiosRequestConfig, SaveReviewsResponse>('/extension/v2/save-reviews', data)
  return response
}
