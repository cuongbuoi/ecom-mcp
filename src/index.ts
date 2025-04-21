import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { configureServer } from './config/server-config.js'
import { registerReviewTools } from './tools/review-tools.js'

// Create the server
const server = configureServer()

// Register tools
registerReviewTools(server)

// Connect the transport
async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error('AliExpress Review Server running on stdio')
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
