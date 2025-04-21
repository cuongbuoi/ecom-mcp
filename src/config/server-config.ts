import { FastMCP } from 'fastmcp'

/**
 * Configuration options for the server
 */
export interface ServerConfig {
  name: string
  version: string
}

/**
 * Default server configuration
 */
export const defaultConfig: ServerConfig = {
  name: 'ecom-mcp',
  version: '1.0.0'
}

/**
 * Create and configure the FastMCP server
 * @param config Configuration options
 * @returns Configured FastMCP server instance
 */
export function createServer(config: Partial<ServerConfig> = {}): FastMCP {
  const finalConfig = { ...defaultConfig, ...config }

  return new FastMCP({
    name: finalConfig.name,
    version: finalConfig.version as `${number}.${number}.${number}`
  })
}
