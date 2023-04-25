# WEBSITE ĐẶT PHÒNG KHÁCH SẠN TRỰC TUYẾN
## thành viên:
- Nguyễn Văn Huy - 51900095 
- Phạm Duy Khoa - 5210901
- Cao Đăng Tình - 52100936
- Nguyễn Thị Thanh Thảo - 52000271

## Các thông tin cần thiết:
### Tài khoản ADMIN:
- username: admin@gmail.com
- password: 123456

### Tài khoản USER:
- username: pham.duykhoa1303@gmail.com
- password: khoa1303

### String connect database: mongodb+srv://nodejs:gtfrGX2bDJpxMS53@cluster0.4twknsi.mongodb.net/?retryWrites=true&w=majority
### Setup database:
- Hệ thống sử dụng cluster với string connect trên file .env nên khi chạy chương trình tự kết nối với database có sẵn
- Các sample data của website nằm ở thư mục data đã được đưa lên cluster

## Các chức năng chính của Website:
### Phía USER:
    - Xem danh sách phòng và chi tiết phòng.
    - Lọc phòng theo số sao đánh giá.
    - Đặt phòng và thanh toán, có thể nhập mã voucher lúc thanh toán.
    - Chọn ngày và phòng cần đặt.
    - Gửi Email quên mật khẩu (bonus).
    - Mua Dịch vụ khách sạn.
    - Đăng nhập, đăng ký.
    - Hiển thị thông báo.
    - Gửi feedback về website và feedback từng loại phòng đã đặt.
    - Chat với admin và xem được các câu trả lời.
    - Quản lý thông tin cá nhân.
    - Xem thông tin trạng thái các phòng đã đặt.
    - Đăng ký thẻ thành viên.
### Phía ADMIN:
    - Xem và lọc đánh giá của khách hàng.
    - Xem thống kê của khách sạn (có thể xuất ra file hoặc hình ảnh).
    - Quản lý đặt phòng.
    - Quản lý dịch vụ (thêm/sửa/xóa).
    - Quản lý câu hỏi của người dùng.
    - Quản lý các voucher (thêm/sửa/xóa/thống kê).
    - Quản lý phòng khách sạn.
    - Quản lý danh sách khách hàng (sửa/xóa).
    - Thông tin chi tiết khách hàng theo tình trạng đặt phòng.
    - Lọc khách hàng theo thẻ đăng ký (VIP, MIDDLE, NORMAL).
    - Quản lý danh sách nhân viên (thêm/sửa/xóa).
    - Thanh toán: tiền lúc khách booking + dịch vụ phát sinh ( xài nước uống trong phòng, đặt gói buffe...)

### Lễ Tân:
    - Chức năng tương tự admin.
    - Không có quyền thêm xóa sửa nhân viên/khách hàng/các thông tin quan trọng của khách sạn.
### Chung:
    - Các chức năng không xóa khỏi database mà chỉ được ẩn đi.

## Chạy chương trình:
- Clone repository về.
- Di chuyển vào thư mục vừa chứa toàn bộ mã nguồn.
- Mở terminal và chạy lệnh: <h5> npm i | npm start </h5>
- Truy cập trình duyệt với đường dẫn: http://localhost:3000/
- Để vào trang admin thì truy cập đường dẫn sau: http://localhost:3000/admin
## Bảng thiết kế website:
- https://www.figma.com/file/OrmZtUY95jkDOtxMynE5tH/Untitled