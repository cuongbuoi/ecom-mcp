import { z } from 'zod'
import { fetchReviews } from '../services/reviews-service.js'
import { formatReviewResponse } from '../utils/format-utils.js'

/**
 * Schema for the get_reviews tool parameters
 */
export const getReviewsSchema = z.object({
  url: z.string().url().describe('URL của sản phẩm AliExpress'),
  minRating: z.number().min(1).max(5).optional().describe('Lọc theo rating tối thiểu (1-5)'),
  limit: z
    .number()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe('Số lượng đánh giá tối đa cần lấy (mặc định: 20, tối đa: 100)')
})

/**
 * Handler function for the get_reviews tool
 */
export const getReviewsHandler = async (args: z.infer<typeof getReviewsSchema>): Promise<string> => {
  try {
    // Fetch reviews data from the API
    const data = await fetchReviews(args.url, args.minRating, args.limit)

    // Format the response
    return formatReviewResponse(data)
  } catch (error) {
    console.error('Error in get_reviews tool:', error)
    throw new Error(`Error fetching reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
