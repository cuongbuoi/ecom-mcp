import { AxiosRequestConfig } from 'axios'
import { httpClient } from '../http-client.ts'
import { ErrorResponse } from '../../types/index.ts'

interface ShopInfoResponse {
  errors?: ErrorResponse[]
  shop_id: number
  shop_name: string
  name: string
  shop_status: boolean
  app_plan: string
  url_pricing: string
  url_origin: string
  current_app_version: string
  app_plan_quantity: number
  version: string
  accept_import_dser: boolean
  accept_import_via_marketplace: boolean
  app_plan_name: string
}

export const getShopInfo = async (): Promise<ShopInfoResponse> => {
  const response = await httpClient.get<AxiosRequestConfig, ShopInfoResponse>('/extension/v2/shop')
  return response
}
