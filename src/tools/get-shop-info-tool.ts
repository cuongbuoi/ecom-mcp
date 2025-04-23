import { z } from 'zod'

const getShopInfoToolSchema = z.object({})

const getShopInfoToolHandler = async (params: z.infer<typeof getShopInfoToolSchema>): Promise<string> => {
  return 'Hello, world!'
}

export const getShopInfoTool = {
  name: 'get_shop_info',
  description: 'Get shop info',
  parameters: getShopInfoToolSchema,
  execute: getShopInfoToolHandler
}
