# Tài liệu KudosiMCP

## Tổng quan
KudosiMCP là một máy chủ được thiết kế để tự động thu thập và phân tích đánh giá sản phẩm từ AliExpress. Tài liệu này cung cấp thông tin toàn diện về chức năng, yêu cầu và thông số kỹ thuật của hệ thống.

## Nội dung tài liệu

1. **[Giới thiệu](introduction_vi.md)**
   - Mục đích của KudosiMCP
   - Đối tượng người dùng mục tiêu

2. **[Yêu cầu chức năng](functional-requirements.md)**
   - Tính năng thu thập đánh giá
   - Khả năng xử lý lỗi
   - Tùy chọn lọc nâng cao
   - Tính năng xác thực và bảo mật

3. **[Thông số kỹ thuật](technical-specifications.md)**
   - Định dạng đầu ra JSON
   - Mô tả trường
   - Cấu trúc phản hồi lỗi
   - Cơ chế xử lý lỗi

## Sử dụng tài liệu này

Tài liệu này tuân theo định dạng đặc tả Gherkin, thường được sử dụng trong Phát triển hướng hành vi (BDD). Cú pháp Gherkin sử dụng cấu trúc đơn giản, dễ đọc giúp dễ dàng hiểu cả yêu cầu và hành vi mong đợi của hệ thống.

Mỗi tính năng được mô tả với các kịch bản phác thảo:
- Trạng thái ban đầu (Given)
- Hành động đang thực hiện (When)
- Kết quả mong đợi (Then)

Định dạng này cho phép cả các bên liên quan kỹ thuật và phi kỹ thuật hiểu hệ thống sẽ hoạt động như thế nào trong các điều kiện khác nhau.

## Ghi chú triển khai

Máy chủ KudosiMCP được thiết kế với khả năng mở rộng và độ tin cậy. Nó triển khai các phương pháp tốt nhất trong ngành cho việc thu thập dữ liệu web, bao gồm:

- Thu thập tôn trọng với độ trễ thích hợp
- Luân chuyển user-agent để giảm thiểu tác động
- Xử lý lỗi mạnh mẽ cho các dịch vụ bên ngoài không ổn định
- Đường ống xử lý dữ liệu hiệu quả
- Cơ chế xác thực an toàn
- Giới hạn tốc độ để ngăn lạm dụng

## Ví dụ sử dụng API

Để biết các ví dụ chi tiết về cách sử dụng API KudosiMCP, vui lòng tham khảo các kịch bản trong tài liệu [Yêu cầu chức năng](functional-requirements.md).

---

Tài liệu cập nhật lần cuối: Tháng 10 năm 2023 