import { z } from 'zod'
import { getShopInfo } from '../services/shop/index.js'
import { Tool, UserError, TextContent } from 'fastmcp'

const getShopInfoToolSchema = z.object({
  platform: z.enum(['aliexpress', 'amazon', 'temu', 'ebay', 'etsy']).default('aliexpress')
})

export const getShopInfoTool: Tool<undefined, typeof getShopInfoToolSchema> = {
  name: 'kds_get_shop_info',
  description:
    'Retrieve detailed information about your e-commerce shop from various platforms (Aliexpress, Amazon, Temu, Ebay, Etsy). This tool returns shop details including name, ID, status, URL, app plan, and version. Use this to check your shop configuration and status across different marketplaces.',
  parameters: getShopInfoToolSchema,
  annotations: {
    title: 'Get Shop Info',
  },
  execute: async (args) => {
    try {
      const data = await getShopInfo({
        platform: args.platform,
        is_marketplace: true
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
    }
  }
}
