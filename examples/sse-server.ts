import { FastMCP } from 'fastmcp'
import { z } from 'zod'
import { fetchReviews } from '../src/services/reviews-service.js'
import { formatReviewResponse } from '../src/utils/format-utils.js'

// Create a FastMCP server for SSE transport
const server = new FastMCP({
  name: 'ecom-mcp-sse',
  version: '1.0.0'
})

// Add the reviews tool
server.addTool({
  name: 'get_reviews',
  description: 'Lấy danh sách đánh giá từ một sản phẩm AliExpress',
  parameters: z.object({
    url: z.string().url().describe('URL của sản phẩm AliExpress'),
    minRating: z.number().min(1).max(5).optional().describe('Lọc theo rating tối thiểu (1-5)'),
    limit: z
      .number()
      .min(1)
      .max(100)
      .optional()
      .default(20)
      .describe('Số lượng đánh giá tối đa cần lấy (mặc định: 20, tối đa: 100)')
  }),
  execute: async (args) => {
    try {
      // Fetch reviews data
      const data = await fetchReviews(args.url, args.minRating, args.limit)

      // Format the response
      return formatReviewResponse(data)
    } catch (error) {
      console.error('Error in get_reviews tool:', error)
      throw new Error(`Error fetching reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
})

// Log connections
server.on('connect', (_event) => {
  console.error('Client connected via SSE')
})

server.on('disconnect', (_event) => {
  console.error('Client disconnected from SSE')
})

// For now, let's use stdio transport since SSE configuration
// requires specific configuration we need to confirm
server.start({
  transportType: 'stdio'
})

console.error('AliExpress Review Server running with stdio transport')
console.error('To use SSE transport, please check FastMCP documentation for correct configuration')
