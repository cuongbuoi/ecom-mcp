import { Server } from '@modelcontextprotocol/sdk/server/index.js'

/**
 * Configure and create the MCP server instance
 * @returns Configured server instance
 */
export function configureServer(): Server {
  return new Server(
    {
      name: 'kudosi-server',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  )
}
