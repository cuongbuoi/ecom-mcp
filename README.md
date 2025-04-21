# AliExpress Reviews API Server

MCP Server cung cấp công cụ truy xuất và phân tích đánh giá sản phẩm từ AliExpress.

## Cài đặt

```bash
yarn install
yarn build
```

## Khởi chạy

```bash
yarn start
```

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

## Công cụ MCP

Server hiện cung cấp công cụ sau:

### get_reviews

Truy xuất đánh giá sản phẩm từ AliExpress.

**Tham số:**

- `url` (string, bắt buộc): URL của sản phẩm AliExpress
- `minRating` (number, tùy chọn): Lọc đánh giá từ mức này trở lên (1-5)
- `limit` (number, tùy chọn): Số lượng đánh giá tối đa (mặc định: 20)

**Ví dụ:**

```json
{
  "url": "https://www.aliexpress.com/item/1005005647140045.html",
  "minRating": 4,
  "limit": 50
}
```

## Phát triển

### Chất lượng mã nguồn

Dự án sử dụng ESLint và Prettier để đảm bảo chất lượng mã nguồn và định dạng nhất quán:

```bash
# Định dạng mã nguồn với Prettier
yarn format

# Kiểm tra vấn đề với ESLint
yarn lint

# Tự động sửa các lỗi ESLint có thể khắc phục
yarn lint:fix
```

### Thêm công cụ mới

1. Định nghĩa schema trong `src/types/schema.ts`
2. Triển khai service trong `src/services/`
3. Thêm các tiện ích định dạng trong `src/utils/` nếu cần
4. Đăng ký và triển khai công cụ trong `src/tools/`

### Biên dịch

```bash
yarn build
```
