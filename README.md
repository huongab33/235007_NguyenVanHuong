# Hệ thống quản lý sách

MSSV: 235007
Họ tên: Nguyễn Văn Hưởng

## Công nghệ sử dụng
- React
- Node.js
- Express
- MongoDB Atlas
- Docker
- GitHub
- Render

## Chức năng
- Xem danh sách sách
- Thêm sách
- Sửa sách
- Xóa sách
- Tìm kiếm sách

## Docker Hub Image (Câu 5)
- **Docker Hub Repository:** https://hub.docker.com/r/vanhuong28/backend
- **Image URL / Tag:** `vanhuong28/backend:latest` (và `vanhuong28/backend:v1`)
- **Image phụ:** `vanhuong28/235007-backend:latest`

### Hướng dẫn chạy container backend:
```bash
# Kéo image từ Docker Hub
docker pull vanhuong28/backend:latest

# Khởi chạy container với biến môi trường
docker run -d -p 5000:5000 \
  -e PORT=5000 \
  -e DB_NAME=235007_NguyenVanHuong \
  -e MONGODB_URI="<chuoi_ket_noi_mongodb_atlas>" \
  -e CORS_ORIGINS="http://localhost:5173,http://localhost:8080" \
  --name backend-app vanhuong28/backend:latest
```
