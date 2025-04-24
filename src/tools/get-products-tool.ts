import { z } from 'zod'
import { getProducts } from '../services/products/index.ts'
import { Tool, UserError, TextContent } from 'fastmcp'

const getProductsToolSchema = z.object({
  search: z.string().optional(),
  page_size: z.number().optional().default(20),
  page_token: z.string().optional().default('')
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
        page_size: params.page_size,
        page_token: params.page_token,
        search: params.search
      })
      log.info('cc', {
        data: JSON.stringify(data)
      })

      const productList = data.products || []
      const nextPageToken = data.pagination?.next_page_token || ''

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

      // Add pagination information
      if (nextPageToken) {
        resultText += `\n\nMore products available. Use page_token: "${nextPageToken}" to view the next page.`
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
