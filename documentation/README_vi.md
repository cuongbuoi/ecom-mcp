# Tài liệu KudosiMCP

## Tổng quan

KudosiMCP là một máy chủ được thiết kế để phân tích các nhiệm vụ Jira và tài nguyên liên quan, sau đó tự động triển khai các tính năng được yêu cầu. Tài liệu này cung cấp thông tin toàn diện về chức năng, yêu cầu và thông số kỹ thuật của hệ thống.

## Nội dung tài liệu

1. **[Giới thiệu](introduction_vi.md)**

   - Mục đích của KudosiMCP
   - Đối tượng người dùng mục tiêu

2. **[Yêu cầu chức năng](functional-requirements.md)**

   - Tính năng phân tích nhiệm vụ Jira có cấu trúc
   - Tích hợp nội dung Confluence
   - Tích hợp GitLab thông qua tham chiếu Cyber Tester
   - Triển khai tính năng tự động
   - Khả năng xử lý lỗi
   - Tính năng xác thực và bảo mật

3. **[Thông số kỹ thuật](technical-specifications.md)**
   - Các định dạng đầu ra JSON cho các giai đoạn phân tích khác nhau
   - Cấu trúc kết quả triển khai
   - Định dạng phản hồi lỗi và cảnh báo
   - Cơ chế xử lý lỗi

## Tích hợp Quy trình Scrum

KudosiMCP được thiết kế để tích hợp liền mạch với phương pháp phát triển Scrum:

1. **Lập kế hoạch Sprint**: KudosiMCP phân tích backlog để xác định các nhiệm vụ sẵn sàng để triển khai
2. **Giai đoạn Phát triển**:
   - Tự động truy xuất các nhiệm vụ có trạng thái "Specify" hoặc "Developing"
   - Chỉ xử lý các mục loại "User story" hoặc "Task"
   - Phân tích mô tả nhiệm vụ và tiêu chí chấp nhận
3. **Triển khai**:
   - Truy xuất bối cảnh nghiệp vụ từ các trang Confluence được liên kết
   - Tham khảo các ví dụ mã và triển khai từ các liên kết GitLab trong phần Cyber Tester
   - Triển khai tính năng theo thông số kỹ thuật
4. **Kiểm thử**: Xác nhận các triển khai dựa trên tiêu chí chấp nhận
5. **Đánh giá**: Tạo báo cáo về trạng thái triển khai và kết quả kiểm thử

Tích hợp quy trình này đảm bảo rằng KudosiMCP có quyền truy cập vào tất cả thông tin cần thiết từ nhiệm vụ Jira, tài liệu Confluence và kho mã GitLab để triển khai thành công các tính năng theo yêu cầu.

## Sử dụng tài liệu này

Tài liệu này tuân theo định dạng đặc tả Gherkin, thường được sử dụng trong Phát triển hướng hành vi (BDD). Cú pháp Gherkin sử dụng cấu trúc đơn giản, dễ đọc giúp dễ dàng hiểu cả yêu cầu và hành vi mong đợi của hệ thống.

Mỗi tính năng được mô tả với các kịch bản phác thảo:

- Trạng thái ban đầu (Given)
- Hành động đang thực hiện (When)
- Kết quả mong đợi (Then)

Định dạng này cho phép cả các bên liên quan kỹ thuật và phi kỹ thuật hiểu hệ thống sẽ hoạt động như thế nào trong các điều kiện khác nhau.

## Ghi chú triển khai

Máy chủ KudosiMCP được thiết kế với trí thông minh và độ tin cậy. Nó triển khai các phương pháp tốt nhất trong ngành cho:

- Phân tích có cấu trúc mô tả nhiệm vụ Jira
- Phân tích toàn diện yêu cầu, bối cảnh và tiêu chí chấp nhận
- Tích hợp với nhiều nguồn dữ liệu (Jira, Confluence, GitLab)
- Phân tích mã thông minh để lập kế hoạch triển khai
- Triển khai tự động tính năng dựa trên yêu cầu
- Kiểm tra và xác nhận dựa trên tiêu chí chấp nhận
- Quản lý thông tin đăng nhập an toàn cho nhiều dịch vụ

## Ví dụ sử dụng API

Để biết các ví dụ chi tiết về cách sử dụng API KudosiMCP, vui lòng tham khảo các kịch bản trong tài liệu [Yêu cầu chức năng](functional-requirements.md).

---

Tài liệu cập nhật lần cuối: Tháng 4 năm 2024
