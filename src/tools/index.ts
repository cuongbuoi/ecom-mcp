import { FastMCP } from 'fastmcp'
import { myTasksTool } from './my-tasks-tool.js'

/**
 * Register all tools with the FastMCP server
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP): void {
  server.addTool(myTasksTool)
}
