# Technical Context

## Technologies Used

### Core Framework

- **Node.js** - JavaScript runtime environment
- **TypeScript** - Typed JavaScript for better code quality
- **fastmcp** - Framework for building Model-Channel-Provider services

### Libraries

- **Axios** - HTTP client for API requests
- **Zod** - Schema validation library
- **dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution and watch mode

## Development Setup

### Environment Variables

The following environment variables are required:

- `KUDOSI_TOKEN` - Authentication token for Kudosi API
- `KUDOSI_API_URL` - Base URL for Kudosi API

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Start development server: `npm run dev`

### Available Scripts

- `npm run dev` - Start the server in development mode (stdio transport)
- `npm run dev:sse` - Start with SSE transport
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier

## Technical Constraints

### API Rate Limits

- E-commerce platforms impose rate limits on API calls
- Tools implement backoff strategies where necessary

### Authentication

- Requires valid token for Kudosi API
- Token must be set as environment variable

### Data Format

- All responses follow standardized JSON formats
- Error responses include descriptive messages and codes

## Dependencies

### Runtime Dependencies

- **fastmcp** (v1.22.4) - Core MCP framework
- **axios** (v1.8.4) - HTTP client for API calls
- **dotenv** (v16.5.0) - Environment variable loading

### Development Dependencies

- **TypeScript** (v5.8.3) - Type checking and compilation
- **ESLint** (v8.56.0) - Code quality enforcement
- **Prettier** (v3.2.4) - Code formatting

## Platform Integration

The system currently supports the following e-commerce platforms:

- Aliexpress
- Amazon
- Temu
- Ebay
- Etsy

Each platform has specific API requirements that are handled by the platform-specific service implementations.
