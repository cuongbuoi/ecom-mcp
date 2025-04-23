import { FastMCP } from 'fastmcp'
import { getProductsTool } from './get-products-tool.ts'
import { getShopInfoTool } from './get-shop-info-tool.ts'
import { saveReviewsTool } from './save-reviews-tool.ts'
/**
 * Register all tools with the FastMCP server
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP): void {
  server.addTool(getShopInfoTool)
  server.addTool(getProductsTool)
  server.addTool(saveReviewsTool)
}
