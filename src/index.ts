import { createServer } from './config/server-config.ts'
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

// Create and start the server
async function start(): Promise<void> {
  try {
    // Create server instance
    const server = createServer()

    // Start the server with stdio transport
    server.start({
      transportType: 'stdio'
    })
  } catch (error) {
    console.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down...')
  process.exit(0)
})

// Start the server
start()
