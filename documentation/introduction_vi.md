# KudosiMCP - Giới thiệu

## Mục đích

KudosiMCP là một máy chủ chuyên biệt được thiết kế để phân tích nội dung từ Jira và các nguồn liên quan như Confluence và GitLab. Nó đóng vai trò như một thành phần trung gian trích xuất, phân tích, và cung cấp dữ liệu có cấu trúc từ các nền tảng này, với khả năng bổ sung để tự động triển khai các tính năng được yêu cầu dựa trên thông số kỹ thuật của nhiệm vụ.

## Quy trình Phát triển

KudosiMCP tuân theo quy trình có cấu trúc cho việc phân tích và triển khai nhiệm vụ:

1. **Lựa chọn Nhiệm vụ**: Tự động truy xuất các nhiệm vụ từ sprint hiện tại có trạng thái "Specify" hoặc "Developing"
2. **Phân tích Nội dung**: Phân tích và cấu trúc hóa mô tả nhiệm vụ Jira thành các phần logic (Bối cảnh, Yêu cầu, Tiêu chí Chấp nhận, v.v.)
3. **Tích hợp Tài nguyên**: Xác định và truy xuất nội dung liên quan từ các trang Confluence được liên kết và kho lưu trữ GitLab
4. **Lập kế hoạch Triển khai**: Phát triển cách tiếp cận chiến lược để triển khai tính năng dựa trên yêu cầu
5. **Tạo Mã**: Triển khai các tính năng theo yêu cầu theo thông số kỹ thuật
6. **Xác thực**: Kiểm tra các triển khai dựa trên tiêu chí chấp nhận đã xác định

## Đối tượng người dùng

- Đội phát triển cần hiểu toàn diện về các nhiệm vụ Jira và yêu cầu của chúng
- Quản lý dự án theo dõi tiến trình triển khai dựa trên phân tích chi tiết nhiệm vụ Jira
- Kỹ sư QA cần triển khai tự động các tính năng dựa trên thông số kỹ thuật có cấu trúc
- Kỹ sư phần mềm tìm cách tự động hóa việc triển khai tính năng dựa trên mô tả nhiệm vụ
- Tổ chức muốn hợp lý hóa quá trình phát triển thông qua phân tích nhiệm vụ và triển khai tự động
