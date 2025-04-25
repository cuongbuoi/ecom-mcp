# System Patterns

## Architecture Overview

The E-commerce MCP is built using a modular architecture with the following key components:

1. **Server Core**

   - Built on fastmcp framework
   - Supports multiple transport types (stdio, SSE)
   - Handles configuration loading and environment validation

2. **Tools Layer**

   - Provides standardized interfaces for e-commerce operations
   - Each tool includes parameter validation using Zod schemas
   - Implements progress reporting during execution

3. **Services Layer**

   - Contains platform-specific implementations
   - Handles API communication with e-commerce platforms
   - Normalizes responses into standard formats

4. **Configuration Layer**
   - Manages environment variables and server settings
   - Validates required configuration at startup

## Key Design Patterns

1. **Tool Pattern**

   - Each e-commerce operation is exposed as a tool with defined:
     - Name and description
     - Parameter schema (using Zod)
     - Execute function with progress reporting
     - Standardized error handling

2. **Service Abstraction**

   - Platform-specific implementations behind common interfaces
   - Allows adding new platforms without changing tool interfaces

3. **Error Handling Pattern**

   - User-facing errors (UserError) for client-side issues
   - Internal error handling for system issues
   - Structured error responses

4. **Progress Reporting**
   - Tools report progress during long-running operations
   - Progress is communicated to the client for better UX

## Data Flow

1. Client sends a request to the MCP server
2. Server validates the request parameters using Zod schemas
3. Server executes the appropriate tool
4. Tool calls necessary services to interact with e-commerce platforms
5. Services translate responses to a standardized format
6. Server returns a structured response to the client

## Technical Decisions

1. **TypeScript**

   - Strong typing for tool parameters and responses
   - Better developer experience and code reliability

2. **Zod Schema Validation**

   - Runtime validation of all inputs
   - Self-documenting parameter specifications

3. **Axios for HTTP Requests**

   - Consistent HTTP client across all services
   - Support for request/response interceptors

4. **Environment-based Configuration**
   - Configuration via environment variables
   - Validation at startup to prevent runtime issues
