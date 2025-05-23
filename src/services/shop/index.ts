import { AxiosRequestConfig } from 'axios'
import { httpClient } from '../http-client.js'
import { ErrorResponse } from '../../types/index.js'

interface ShopInfoRequest {
  platform: string
  is_marketplace: boolean
}

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

export const getShopInfo = async (params: ShopInfoRequest): Promise<ShopInfoResponse> => {
  return await httpClient.get<AxiosRequestConfig, ShopInfoResponse>('/extension/v2/shop', { params })
}
