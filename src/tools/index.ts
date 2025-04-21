import { FastMCP } from 'fastmcp'
import { getReviewsHandler, getReviewsSchema } from './review-tools.js'

/**
 * Register all tools with the FastMCP server
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP): void {
  // Register the get_reviews tool
  server.addTool({
    name: 'get_reviews',
    description: 'Lấy danh sách đánh giá từ một sản phẩm AliExpress',
    parameters: getReviewsSchema,
    execute: getReviewsHandler
  })
}
