import { createServer } from './config/server-config.ts'
import { registerTools } from './tools/index.ts'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.KUDOSI_TOKEN) {
  console.error('Error: KUDOSI_TOKEN key not set')
  process.exit(1)
}

if (!process.env.KUDOSI_API_URL) {
  console.error('Error: KUDOSI_API_URL key not set')
  process.exit(1)
}

// Create server instance
const server = createServer()

// Register all tools
registerTools(server)

// Start the server with stdio transport
server.start({
  transportType: 'stdio'
})
