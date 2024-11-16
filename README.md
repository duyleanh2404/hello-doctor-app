# Hello Bacsi

## Medical Appointment Booking System  
08/2024 - 11/2024

Hello Bacsi là nền tảng đặt lịch hẹn y tế trực tuyến, giúp người dùng dễ dàng tìm kiếm thông tin về bác sĩ, bệnh viện, và chuyên khoa y tế, đồng thời đặt lịch hẹn. Nền tảng này cũng cung cấp các dịch vụ chăm sóc sức khỏe từ xa với nhiều tính năng hỗ trợ.

### Mục lục
- Tính năng
- Công nghệ sử dụng
- Hướng dẫn cài đặt
- Ảnh minh họa
- Đóng góp
- Thông tin liên hệ

### Ảnh minh họa
- ![Giao diện đặt lịch hẹn](https://github.com/duyleanh2404/hello-doctor-app/blob/a3a6a4c0e558a48d4f74c2e484c51f55e805d408/public/readme/readme-7.png)

### Tính năng
- **Đăng ký, đăng nhập, và xác thực:** Sử dụng JWT và OAuth2 để xác thực người dùng.
- **Xác thực OTP:** Gửi mã OTP qua email để xác minh tài khoản.
- **Hỗ trợ chatbot:** Tích hợp Gemini 1.5 Flash để hỗ trợ bệnh nhân giải đáp thắc mắc.
- **Đặt lịch hẹn:** Lọc lịch hẹn theo ngày, bệnh viện, bác sĩ, và chuyên khoa.
- **Tích hợp thanh toán:**
  - Thanh toán tiền mặt (COD) với xác minh qua email.
  - Thanh toán qua VNPay (môi trường thử nghiệm).
- **Quản lý người dùng và dữ liệu:** Thêm, sửa, hoặc xóa thông tin người dùng, bác sĩ, bệnh viện, chuyên khoa, bài viết, và lịch trình của bác sĩ.
- **Chỉnh sửa bài viết:** Cung cấp trình chỉnh sửa văn bản chuyên nghiệp.
- **Xác nhận lịch hẹn:** Gửi email xác nhận với hình ảnh đơn thuốc từ bác sĩ.

### Công nghệ sử dụng
- **Frontend:** Next.js, Tailwind CSS, Shadcn/UI, Redux Toolkit, React Hook Form.
- **Backend:** NestJS, MongoDB, Nodemailer.
- **Xác thực:** JWT và OAuth2.
- **Thanh toán:** VNPay (môi trường thử nghiệm).
- **Hỗ trợ Chatbot:** Gemini 1.5 Flash.

### Hướng dẫn cài đặt

#### Frontend
Clone repo:
```bash
git clone https://github.com/duyleanh2404/hello-doctor-app
cd hello-doctor-app
