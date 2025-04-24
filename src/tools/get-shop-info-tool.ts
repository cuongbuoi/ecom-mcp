import { z } from 'zod'
import { getShopInfo } from '../services/shop/index.ts'
import { Tool, UserError, TextContent } from 'fastmcp'

const getShopInfoToolSchema = z.object({})

export const getShopInfoTool: Tool<undefined, typeof getShopInfoToolSchema> = {
  name: 'get_shop_info',
  description: 'Get shop info',
  parameters: getShopInfoToolSchema,
  execute: async (params, { log, reportProgress }) => {
    try {
      reportProgress({
        progress: 0,
        total: 100
      })
      const data = await getShopInfo({
        platform: 'aliexpress',
        is_marketplace: true
      })
      log.info('shop_info', {
        data: JSON.stringify(data)
      })

      // Create natural language summary
      const shopStatusText = data.shop_status ? 'active' : 'inactive'

      let resultText = `Your shop information has been successfully retrieved. Shop "${data.shop_name}" (ID: ${data.shop_id}) is currently ${shopStatusText}. You can access your shop at ${data.url_origin}.\n\n`

      resultText += `Shop name: ${data.shop_name}\n`
      resultText += `Shop id: ${data.shop_id}\n`
      resultText += `Shop status: ${data.shop_status}\n`
      resultText += `Shop url: ${data.url_origin}\n`
      resultText += `App plan: ${data.app_plan_name || data.app_plan}\n`
      resultText += `App version: ${data.current_app_version || data.version}`

      const result: TextContent = {
        type: 'text',
        text: resultText
      }

      return result
    } catch (error) {
      throw new UserError('Error: ' + error)
    } finally {
      reportProgress({
        progress: 100,
        total: 100
      })
    }
  }
}
