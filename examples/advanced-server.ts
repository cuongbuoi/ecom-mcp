import { FastMCP } from 'fastmcp'
import { z } from 'zod'
import { fetchReviews } from '../src/services/reviews-service.js'
import { formatReviewResponse } from '../src/utils/format-utils.js'

// Create a FastMCP server with more configuration options
const server = new FastMCP({
  name: 'ecom-mcp-advanced',
  version: '1.0.0'
  // You can add authentication if needed
  // authenticate: ({ request }) => {
  //   const apiKey = request.headers.get('x-api-key')
  //   if (apiKey !== 'your-secret-key') {
  //     throw new Response(null, { status: 401, statusText: 'Unauthorized' })
  //   }
  //   return { id: 'authenticated-user' }
  // },
})

// Register event listeners
server.on('connect', (_event) => {
  console.error(`Client connected`)
})

server.on('disconnect', (_event) => {
  console.error(`Client disconnected`)
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
  execute: async (args, context) => {
    if (context.session) {
      console.error(`Processing request`)
    }
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

// You can add a resource to provide documentation
server.addResource({
  uri: 'help:///documentation',
  name: 'AliExpress Reviews API Documentation',
  mimeType: 'text/plain',
  async load() {
    return {
      text: `
# AliExpress Reviews API

This API allows you to fetch reviews from AliExpress products.

## Tools

### get_reviews

Fetches reviews for an AliExpress product.

Parameters:
- url (string, required): URL of the AliExpress product
- minRating (number, optional): Filter reviews by minimum rating (1-5)
- limit (number, optional): Maximum number of reviews to return (default: 20, max: 100)

Example:
{
  "url": "https://www.aliexpress.com/item/1234567890.html",
  "minRating": 4,
  "limit": 10
}
      `.trim()
    }
  }
})

// Add a prompt template
server.addPrompt({
  name: 'review-analysis',
  description: 'Generate analysis of AliExpress product reviews',
  arguments: [
    {
      name: 'url',
      description: 'URL of the AliExpress product',
      required: true
    },
    {
      name: 'minRating',
      description: 'Minimum rating to include (1-5)',
      required: false
    }
  ],
  load: async (args) => {
    return `
You are a helpful shopping assistant that analyzes product reviews from AliExpress.

Please analyze the reviews for the product at ${args.url}.
${args.minRating ? `Only consider reviews with a rating of ${args.minRating} or higher.` : ''}

First, summarize the overall sentiment of the reviews. Then, identify:
1. Most commonly mentioned positive features
2. Most commonly mentioned negative issues
3. Any quality or durability concerns
4. Any shipping or seller issues
5. Whether customers feel the product is worth the price

Conclude with a recommendation on whether to purchase the product based on the reviews.
`.trim()
  }
})

// Start the server with stdio transport instead of http (fastmcp supports 'stdio' or 'sse')
server.start({
  transportType: 'stdio'
})

console.error('AliExpress Review Server running with stdio transport')
