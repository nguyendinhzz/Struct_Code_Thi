# Ứng dụng Quản Lý Tài Chính

## Hướng dẫn Deploy sử dụng Docker

### Yêu cầu
- Docker và Docker Compose đã được cài đặt
- Ubuntu Server

### Các bước deploy

1. Copy toàn bộ mã nguồn lên VPS:
   ```bash
   scp -r /path/to/your/project user@your-vps-ip:/path/on/vps
   ```

2. Kết nối SSH vào VPS:
   ```bash
   ssh user@your-vps-ip
   ```

3. Tạo file .env từ mẫu:
   ```bash
   cp .env
   ```

4. Chỉnh sửa file .env với thông tin cấu hình thực tế:
   ```bash
   nano .env
   ```
   
   Cập nhật các thông tin:
   ```
   PORT=3000
   DB_HOST=mysql
   DB_USER=root
   DB_PASSWORD=your_secure_password
   DB_NAME=your_database_name
   JWT_SECRET=your_secure_jwt_secret
   ```

5. Build và khởi động containers:
   ```bash
   docker-compose up -d
   ```
6. Create database
   ```bash
   CREATE DATABASE TaiChinhDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
7. Kiểm tra logs để đảm bảo ứng dụng hoạt động:
   ```bash
   docker-compose logs -f app
   ```

8. Truy cập ứng dụng tại: `http://your-vps-ip:3000`


### Quản lý ứng dụng

- Query mysql
  ```bash
     docker exec -it mysql_db mysql -u root -p
     or
     docker exec -i mysql_db mysql -u root -pYourPassDB YourNameDB < init.sql
  ```

- Khởi động lại ứng dụng:
  ```bash
  docker-compose restart
  ```
  
- Cập nhật ứng dụng (sau khi có thay đổi):
  ```bash
  git pull
  docker-compose down
  docker-compose up -d --build
  ```
