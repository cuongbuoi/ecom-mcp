import { createServer } from './config/server-config.js'
import { registerTools } from './tools/index.js'

// Create server instance
const server = createServer()

// Register all tools
registerTools(server)

// Start the server with stdio transport
server.start({
  transportType: 'stdio'
})

console.error('Kudosi MCP Server running on stdio')
