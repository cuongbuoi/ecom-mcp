import z from 'zod'

/**
 * Schema for the get_reviews tool parameters
 */
export const getReviewsSchema = z.object({
  url: z.string().url().describe('URL của sản phẩm AliExpress'),
  minRating: z.number().min(1).max(5).optional().describe('Lọc theo rating tối thiểu (1-5)'),
  limit: z.number().min(1).max(100).optional().default(20).describe('Số lượng đánh giá tối đa cần lấy')
})

/**
 * Type for the get_reviews tool parameters
 */
export type GetReviewsParams = z.infer<typeof getReviewsSchema>

/**
 * Tool definitions for the list tools request handler
 */
export const toolDefinitions = [
  {
    name: 'get_reviews',
    description: 'Lấy danh sách đánh giá từ một sản phẩm AliExpress',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL của sản phẩm AliExpress'
        },
        minRating: {
          type: 'number',
          description: 'Lọc theo rating tối thiểu (1-5)'
        },
        limit: {
          type: 'number',
          description: 'Số lượng đánh giá tối đa cần lấy (mặc định: 20, tối đa: 100)'
        }
      },
      required: ['url']
    }
  }
]
