# AliExpress Reviews MCP Server

This Model Context Protocol (MCP) server allows AI assistants to fetch user reviews from AliExpress products.

## Features

- Fetch reviews from AliExpress products
- Filter reviews by minimum rating
- Limit the number of reviews returned
- Summary of review statistics

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecom-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Run the server

```bash
npm start
```

### Test with MCP tools

You can test the server using FastMCP's CLI tools:

```bash
# Test with FastMCP dev tool
npm run dev

# Test with FastMCP inspector
npm run inspect
```

### Examples

The project includes several example implementations:

```bash
# Run basic example
npm run example:basic

# Run advanced example with more features
npm run example:advanced

# Run example with stdio transport (default)
npm run example:sse
```

### Tool Documentation

The server provides the following tool:

#### get_reviews

Fetches reviews for an AliExpress product.

**Parameters:**

- `url` (string, required): URL of the AliExpress product
- `minRating` (number, optional): Filter reviews by minimum rating (1-5)
- `limit` (number, optional): Maximum number of reviews to return (default: 20, max: 100)

**Example:**

```json
{
  "url": "https://www.aliexpress.com/item/1234567890.html",
  "minRating": 4,
  "limit": 10
}
```

## Development

### Commands

- `npm run build`: Build the TypeScript project
- `npm run start`: Start the MCP server
- `npm run dev`: Run the server with FastMCP dev tool
- `npm run inspect`: Run the server with FastMCP inspector
- `npm run lint`: Run linting checks
- `npm run lint:fix`: Fix linting issues
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check formatting without making changes

## Project Structure

The project uses a streamlined structure with FastMCP:

```
src/
├── services/             # Service layer
│   └── reviews-service.ts  # Service for fetching product reviews
├── utils/                # Utility functions
│   └── format-utils.ts     # Formatting utilities for reviews
└── index.ts              # Main entry point with FastMCP configuration

examples/                 # Example implementations
├── basic-server.ts       # Basic FastMCP example
├── advanced-server.ts    # Advanced example with more features
└── sse-server.ts         # Example configured for SSE transport
```

## License

ISC

## Cấu trúc dự án

Dự án được tổ chức theo cấu trúc mô-đun để dễ bảo trì và mở rộng:

```
src/
├── config/           # Cấu hình hệ thống
│   └── server-config.ts   # Cấu hình MCP server
├── services/         # Dịch vụ API
│   └── reviews-service.ts # Service truy xuất đánh giá
├── tools/            # Công cụ MCP
│   └── review-tools.ts    # Công cụ quản lý đánh giá
├── types/            # Định nghĩa kiểu dữ liệu
│   └── schema.ts     # Schema Zod
├── utils/            # Tiện ích
│   └── format-utils.ts    # Hàm định dạng
└── index.ts          # Điểm khởi đầu ứng dụng
```

## Phát triển

### Chất lượng mã nguồn

Dự án sử dụng ESLint và Prettier để đảm bảo chất lượng mã nguồn và định dạng nhất quán:

```bash
# Định dạng mã nguồn với Prettier
npm run format

# Kiểm tra vấn đề với ESLint
npm run lint

# Tự động sửa các lỗi ESLint có thể khắc phục
npm run lint:fix
```

### Thêm công cụ mới

1. Định nghĩa schema trong `src/types/schema.ts`
2. Triển khai service trong `src/services/`
3. Thêm các tiện ích định dạng trong `src/utils/` nếu cần
4. Đăng ký và triển khai công cụ trong `src/tools/`

### Biên dịch

```bash
npm run build
```
