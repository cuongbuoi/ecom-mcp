import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { fetchReviews } from '../services/reviews-service.js'
import { formatReviewResponse } from '../utils/format-utils.js'
import { getReviewsSchema, toolDefinitions } from '../types/schema.js'

/**
 * Type definition for tool response for compatibility with MCP SDK
 */
interface ToolResponse {
  isError?: boolean
  content: Array<{
    type: string
    text: string
  }>
  [key: string]: unknown
}

/**
 * Register all review-related tools with the MCP server
 * @param server The MCP server instance
 */
export function registerReviewTools(server: Server): void {
  // Register the list tools handler
  registerListToolsHandler(server)

  // Register the call tool handler
  registerCallToolHandler(server)
}

/**
 * Register the list tools request handler
 * @param server The MCP server instance
 */
function registerListToolsHandler(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: toolDefinitions
    }
  })
}

/**
 * Register the call tool request handler
 * @param server The MCP server instance
 */
function registerCallToolHandler(server: Server): void {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'get_reviews') {
      return handleGetReviews(request.params.arguments)
    }

    // Handle unknown tool
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${request.params.name}`
        }
      ]
    }
  })
}

/**
 * Handle the get_reviews tool call
 * @param args Tool arguments from the request
 * @returns Formatted response with product reviews
 */
async function handleGetReviews(args: unknown): Promise<ToolResponse> {
  try {
    // Parse and validate arguments using zod
    const validArgs = getReviewsSchema.parse(args)

    // Fetch reviews data from the API
    const data = await fetchReviews(validArgs.url, validArgs.minRating, validArgs.limit)

    // Format the response
    const result = formatReviewResponse(data)

    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    }
  } catch (error) {
    console.error('Error in get_reviews tool:', error)

    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error fetching reviews: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ]
    }
  }
}
