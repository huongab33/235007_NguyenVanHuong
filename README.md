# Hệ thống quản lý sách

- **MSSV:** 235007
- **Họ tên:** Nguyễn Văn Hưởng

## Công nghệ sử dụng
- React 19 (Vite)
- Node.js & Express
- MongoDB Atlas
- Docker & Docker Hub
- GitHub
- Render

## Chức năng
- Xem danh sách sách
- Thêm sách mới
- Chỉnh sửa thông tin sách
- Xóa sách
- Tìm kiếm sách theo tiêu đề / tác giả / thể loại

---

## 1. Docker Hub Image (Câu 5)
- **Docker Hub Repository:** https://hub.docker.com/r/vanhuong28/backend
- **Image URL / Tag:** `vanhuong28/backend:latest` (và `vanhuong28/backend:v1`)
- **Image phụ (theo MSSV):** `vanhuong28/235007-backend:latest`

### Lệnh chạy container backend:
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

---

## 2. Triển khai trên Render (Câu 6 & Câu 7)
- **Frontend URL:** https://two35007-nguyenvanhuong.onrender.com
- **Backend API URL:** https://backend-235007.onrender.com
- **Health Check API:** https://backend-235007.onrender.com/health
- **Books API Endpoint:** https://backend-235007.onrender.com/api/books
