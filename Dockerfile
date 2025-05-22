FROM node:18-alpine

# Tạo thư mục ứng dụng
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Sao chép mã nguồn ứng dụng
COPY . .

# Expose port mà ứng dụng sử dụng
EXPOSE 3000

# Lệnh khởi động ứng dụng
CMD ["node", "app.js"] 