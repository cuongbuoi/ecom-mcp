# Kudosi Model Context Protocol (MCP)

This project provides a Model Context Protocol (MCP) service that enables AI models to seamlessly interact with the Shopify e-commerce platform. It offers specialized tools to retrieve shop information, access product data, and manage reviews from external sources.

## Overview

Kudosi MCP serves as a powerful bridge between AI assistants and the Kudosi app for Shopify. The Kudosi app helps Shopify merchants effectively manage product reviews, analyze customer feedback, and improve their store's performance. This MCP enables AI assistants to:

- Access comprehensive shop data from Shopify stores using the Kudosi app
- Retrieve and efficiently search through product listings
- Import and manage product reviews from various external sources
- Help merchants analyze and strategically respond to customer feedback
- Provide data-driven insights based on review analysis to improve product offerings

By integrating with this MCP, AI assistants can offer Shopify merchants powerful tools for managing their e-commerce business through intuitive natural language conversations.

## Features

- **Shop Information Retrieval**: Access detailed information about Shopify stores including name, ID, status, URL, plan, and version
- **Product Management**: Efficiently retrieve and search product listings from Shopify stores
- **Review Management**: Seamlessly import and save product reviews from external sources to Shopify

## Installation

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Cursor IDE (for development)
- Claude desktop (for AI assistance)

### Setup Steps

1. Clone the repository

   ```bash
   git clone https://github.com/cuongbuoi/ecom-mcp.git
   cd ecom-mcp
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   KUDOSI_TOKEN=your_token_here
   ```

## Usage

### Running Your MCP Server

There are multiple ways to run your MCP server depending on your specific needs:

#### Test with CLI

The easiest way to test and debug your server in the terminal:

```bash
npm run cli
```

This runs your server with [`mcp-cli`](https://github.com/wong2/mcp-cli), allowing you to test your tools and debug issues interactively in the terminal.

#### Setup before use

```bash
npm run build
```

```bash
npm i -g .
```

### Using with Claude Desktop

To use this MCP server with Claude Desktop:

1. Follow the comprehensive guide at https://modelcontextprotocol.io/quickstart/user
2. Add your MCP server configuration in Claude Desktop settings
3. Connect Claude to your local MCP server to access shop information, products, and review management tools

### Using with Cursor IDE

1. Open the project in Cursor IDE
2. Configure the MCP in Cursor's settings by adding to your `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "kudosi-mcp": {
      "command": "kds-save-review-mcp",
      "env": {
        "KUDOSI_API_URL": "https://your-api-url",
        "KUDOSI_TOKEN": "your-token-here"
      }
    }
  }
}
```

3. Restart Cursor IDE to apply the configuration
4. Your MCP tools will now be available to Claude and other AI assistants in Cursor

### Available Scripts

- `npm run build` - Build the project for use with MCP clients
- `npm run cli` - Test and debug your MCP server in the terminal
- `npm run dev` - Start the server in development mode (stdio transport)
- `npm run dev:sse` - Start with SSE transport
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier

## API Tools

### Shop Information

Retrieve comprehensive Shopify shop information including name, ID, status, and URL.

### Product Management

Get, search, and filter products from connected Shopify stores with powerful querying capabilities.

### Review Management

Efficiently import and save product reviews from external sources to your Shopify store for centralized management.

## Project Structure

```
ecom-mcp/
├── src/
│   ├── config/       # Server and application configuration
│   ├── services/     # Service implementations
│   ├── tools/        # Tool implementations for MCP
│   ├── types/        # TypeScript type definitions
│   └── index.ts      # Application entry point
├── .env              # Environment variables (create this file)
└── package.json      # Project dependencies and scripts
```

## License

MIT License

## Support

For issues or feature requests, please open an issue on the GitHub repository.
