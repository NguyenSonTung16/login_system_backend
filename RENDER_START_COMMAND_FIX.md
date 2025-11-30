# 🔧 Fix Lỗi "nest: not found" trên Render

## ❌ Lỗi

```
> nest start
sh: 1: nest: not found
==> Exited with status 127
```

## 🔍 Nguyên Nhân

Render đang chạy lệnh `npm run start` (dev command) thay vì `npm run start:prod` (production command).

- `npm run start` → chạy `nest start` (cần `@nestjs/cli` - là dev dependency, không có trong production)
- `npm run start:prod` → chạy `node dist/main` (chạy từ file đã build)

## ✅ Giải Pháp

### Bước 1: Vào Render Dashboard

1. Truy cập [dashboard.render.com](https://dashboard.render.com)
2. Chọn service backend của bạn

### Bước 2: Sửa Start Command

1. Click vào tab **Settings**
2. Tìm phần **Build & Deploy**
3. Tìm field **Start Command**
4. Thay đổi từ:
   ```
   npm run start
   ```
   Thành:
   ```
   npm run start:prod
   ```
5. Click **Save Changes**

### Bước 3: Kiểm Tra Cấu Hình Đầy Đủ

Đảm bảo các cấu hình sau đúng:

- **Root Directory**: 
  - Để **TRỐNG** nếu code ở root level
  - Hoặc `user-registration-api` nếu code trong thư mục đó

- **Build Command**: 
  ```
  npm install && npm run build
  ```

- **Start Command**: 
  ```
  npm run start:prod
  ```

### Bước 4: Deploy Lại

1. Vào tab **Manual Deploy**
2. Click **Deploy latest commit**
3. Đợi deploy xong
4. Kiểm tra Logs để đảm bảo không có lỗi

## 📋 Environment Variables

Đảm bảo đã thêm các biến môi trường:

1. Vào tab **Environment**
2. Thêm/kiểm tra các biến:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

**Lưu ý:** PORT được Render tự động set, không cần thêm.

## ✅ Kết Quả Mong Đợi

Sau khi deploy thành công, bạn sẽ thấy trong logs:

```
> user-registration-api@0.0.1 start:prod
> node dist/main

🚀 Backend đang chạy tại: http://localhost:xxxx
```

## 🆘 Vẫn Gặp Lỗi?

### Lỗi "Cannot find module"

- Kiểm tra Build Command có chạy `npm install` không
- Đảm bảo tất cả dependencies được cài đặt

### Lỗi "Port already in use"

- Render tự động set PORT, không cần config
- Kiểm tra code có đọc từ `process.env.PORT` không

### Lỗi MongoDB Connection

- Kiểm tra `MONGO_URI` đúng format chưa
- Kiểm tra MongoDB Atlas Network Access đã whitelist chưa

## 💡 Lưu Ý Quan Trọng

- ✅ **Luôn dùng `start:prod`** cho production
- ✅ Build phải chạy trước khi start
- ✅ File `dist/main.js` phải tồn tại sau khi build
- ✅ Environment variables phải được set trước khi deploy

