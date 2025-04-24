import { z } from 'zod'
import { getProducts } from '../services/products/index.ts'
import { Tool, UserError, TextContent } from 'fastmcp'

const getProductsToolSchema = z.object({
  search: z.string().optional()
})

export const getProductsTool: Tool<undefined, typeof getProductsToolSchema> = {
  name: 'get_products',
  description: 'Get all products of store',
  parameters: getProductsToolSchema,
  execute: async (params, { log, reportProgress }) => {
    try {
      reportProgress({
        progress: 0,
        total: 100
      })
      const data = await getProducts({
        page_size: 100,
        page_token: '',
        search: params.search
      })
      log.info('cc', {
        data: JSON.stringify(data)
      })

      const productList = data.products || []

      let resultText = `Retrieved ${productList.length} products${params.search ? ` matching "${params.search}"` : ''}.\n\n`

      // Add information about each product
      productList.forEach((product, index) => {
        resultText += `Product ${index + 1}: ${product.title} (ID: ${product.product_id})\n`
        resultText += `Price: ${product.price} - Status: ${product.status ? 'Active' : 'Inactive'}\n`
        resultText += `Reviews: ${product.total_reviews} - Average Rating: ${product.average_rating}\n`
        if (index < productList.length - 1) {
          resultText += '---\n'
        }
      })

      if (productList.length === 0) {
        resultText += 'No products found.'
      }

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
