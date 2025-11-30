# 🔧 Hướng Dẫn Fix Lỗi Render

## ❌ Lỗi Gặp Phải

```
Service Root Directory "/opt/render/project/src/user-registration-api" is missing.
builder.sh: line 51: cd: /opt/render/project/src/user-registration-api: No such file or directory
```

## ✅ Giải Pháp

Sau khi push code lên GitHub, bạn có **2 lựa chọn** để cấu hình Render:

### Lựa Chọn 1: Sử Dụng Code Ở Root Level (Khuyên Dùng)

Code NestJS đã có ở root level của repository. Cấu hình Render như sau:

1. Vào **Render Dashboard** → Chọn service của bạn
2. Vào tab **Settings**
3. Tìm phần **Build & Deploy**
4. Cấu hình:
   - **Root Directory**: Để **TRỐNG** hoặc `.`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. Click **Save Changes**
6. Vào tab **Manual Deploy** → Click **Deploy latest commit**

### Lựa Chọn 2: Sử Dụng Code Trong Thư Mục `user-registration-api`

Nếu bạn muốn sử dụng code trong thư mục `user-registration-api`:

1. Vào **Render Dashboard** → Chọn service của bạn
2. Vào tab **Settings**
3. Tìm phần **Build & Deploy**
4. Cấu hình:
   - **Root Directory**: `user-registration-api` (KHÔNG có `/src/` phía trước)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. Click **Save Changes**
6. Vào tab **Manual Deploy** → Click **Deploy latest commit`

## 📋 Environment Variables

Đảm bảo bạn đã thêm các environment variables sau:

1. Vào tab **Environment**
2. Thêm các biến:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=10000
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

**Lưu ý:** 
- Render tự động set PORT, bạn có thể bỏ qua biến PORT
- Cập nhật `FRONTEND_ORIGIN` sau khi có URL frontend

## ✅ Kiểm Tra Sau Khi Deploy

1. Vào tab **Logs** để xem quá trình build
2. Kiểm tra không có lỗi
3. Test API endpoint: `https://your-service.onrender.com`
4. Kiểm tra health check (nếu có)

## 🆘 Vẫn Gặp Lỗi?

1. **Kiểm tra Logs**: Vào tab Logs xem chi tiết lỗi
2. **Kiểm tra Root Directory**: Đảm bảo đúng path
3. **Kiểm tra Build Command**: Đảm bảo có `npm install`
4. **Xóa và tạo lại service**: Nếu vẫn không được, thử xóa service cũ và tạo lại

## 💡 Khuyến Nghị

**Nên dùng Lựa Chọn 1** (Root Directory trống) vì:
- Code đã có sẵn ở root level
- Cấu hình đơn giản hơn
- Ít phức tạp hơn

