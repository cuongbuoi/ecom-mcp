import { AxiosRequestConfig } from 'axios'
import { ErrorResponse } from '../../types/index.js'
import { httpClient } from '../http-client.js'

export interface Review {
  review_id: string
  author: string
  star?: number
  country?: string
  content?: string
  images?: string[]
  platform: string
  status: boolean
  imported_at?: string
  created_at: string
  updated_at?: string
}

export interface SaveReviewsRequest {
  platform: string
  product_id: number
  reviews: Review[]
  job_import_id: string
  link: string
  external_product_id: string
}

export interface SaveReviewsResponse {
  errors?: ErrorResponse[]
  count_duplicated_reviews?: number
  count_processed_reviews?: number
  count_reviews?: number
  count_filtered_reviews?: number
  status_code: number
}

export const saveReviews = async (data: SaveReviewsRequest): Promise<SaveReviewsResponse> => {
  return await httpClient.post<AxiosRequestConfig, SaveReviewsResponse>('/extension/save-reviews', data)
}

interface CreateImportJobRequest {
  product_id: number
  link: string
  external_product_id: string
}

interface CreateImportJobResponse {
  errors?: ErrorResponse[]
  job_import_id?: string
  status_code: number
}

export const createImportJob = async (data: CreateImportJobRequest): Promise<CreateImportJobResponse> => {
  return await httpClient.post<AxiosRequestConfig, CreateImportJobResponse>('/extension/create-import', data)
}
