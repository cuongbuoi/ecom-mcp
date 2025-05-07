import { FastMCP } from 'fastmcp'
import { getProductsTool } from './get-products-tool.js'
import { getShopInfoTool } from './get-shop-info-tool.js'
import { saveReviewsTool } from './save-reviews-tool.js'
/**
 * Register all tools with the FastMCP server
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP): void {
  server.addTool(getShopInfoTool)
  server.addTool(getProductsTool)
  server.addTool(saveReviewsTool)
}
