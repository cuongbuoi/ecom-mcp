import { z } from 'zod'
import { getProducts, Product } from '../services/products/index.ts'

const getProductsToolSchema = z.object({
  search: z.string().optional()
})

const getProductsToolHandler = async (params: z.infer<typeof getProductsToolSchema>): Promise<string> => {
  try {
    const data = await getProducts({
      page_size: 100,
      page_token: '',
      search: params.search
    })
    return JSON.stringify(data.products || [])
  } catch (error) {
    throw new Error('Error: ' + error)
  }
}

export const getProductsTool = {
  name: 'get_products',
  description: 'Get all products of store',
  parameters: getProductsToolSchema,
  execute: getProductsToolHandler
}
