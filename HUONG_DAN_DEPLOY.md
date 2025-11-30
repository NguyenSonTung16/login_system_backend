# Hướng Dẫn Deploy Backend lên Cloud

Hướng dẫn này sẽ giúp bạn deploy ứng dụng NestJS backend lên các nền tảng cloud.

## Các Tùy Chọn Deploy

### 1. Render (Khuyên Dùng - Miễn Phí)

**Ưu điểm:**
- Miễn phí tier với một số giới hạn
- Dễ thiết lập
- Auto-deploy từ GitHub
- Hỗ trợ MongoDB Atlas

#### Bước 1: Tạo tài khoản Render

1. Truy cập [render.com](https://render.com)
2. Đăng nhập bằng GitHub

#### Bước 2: Tạo Web Service

1. Click "New +" → "Web Service"
2. Chọn repository từ GitHub
3. Cấu hình:
   - **Name**: `login-system-backend` (hoặc tên bạn muốn)
   - **Region**: Singapore (gần Việt Nam)
   - **Branch**: `main`
   - **Root Directory**: `user-registration-api`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

#### Bước 3: Thêm Environment Variables

Trong phần Environment Variables, thêm:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=3000
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

**Lưu ý:**
- `MONGO_URI`: Connection string từ MongoDB Atlas (xem hướng dẫn bên dưới)
- `FRONTEND_ORIGIN`: URL frontend đã deploy (ví dụ: `https://your-project.vercel.app`)

#### Bước 4: Deploy

1. Click "Create Web Service"
2. Render sẽ tự động build và deploy
3. URL sẽ được cung cấp: `https://your-service.onrender.com`

#### Bước 5: Thiết lập MongoDB Atlas

1. Truy cập [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo tài khoản miễn phí
3. Tạo cluster (chọn FREE tier)
4. Vào Database Access → Add New Database User
5. Vào Network Access → Add IP Address (thêm `0.0.0.0/0` để cho phép tất cả)
6. Vào Database → Connect → Connect your application
7. Copy connection string và thay `<password>` bằng password đã tạo

### 2. Railway (Miễn Phí với Credit Card)

**Ưu điểm:**
- Dễ sử dụng
- Auto-deploy từ GitHub
- Hỗ trợ database tích hợp

#### Bước 1: Tạo tài khoản Railway

1. Truy cập [railway.app](https://railway.app)
2. Đăng nhập bằng GitHub
3. Thêm credit card (miễn phí nhưng cần để xác thực)

#### Bước 2: Tạo Project

1. Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository

#### Bước 3: Cấu hình Service

1. Railway tự động phát hiện là Node.js project
2. Chọn root directory: `user-registration-api`
3. Cấu hình:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

#### Bước 4: Thêm Environment Variables

Vào Variables tab, thêm:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

#### Bước 5: Thêm MongoDB (Tùy chọn)

Railway có thể cung cấp MongoDB:
1. Click "New" → "Database" → "Add MongoDB"
2. Railway sẽ tự động tạo và thêm `MONGO_URI` vào environment variables

### 3. Heroku (Có phí sau khi hết free tier)

**Lưu ý:** Heroku đã ngừng free tier, nhưng vẫn có thể dùng với giá rẻ.

#### Bước 1: Cài đặt Heroku CLI

```bash
# Windows - Download từ https://devcenter.heroku.com/articles/heroku-cli
```

#### Bước 2: Login

```bash
heroku login
```

#### Bước 3: Tạo App

```bash
cd user-registration-api
heroku create your-app-name
```

#### Bước 4: Thêm Environment Variables

```bash
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set FRONTEND_ORIGIN="https://your-frontend.com"
```

#### Bước 5: Deploy

```bash
git push heroku main
```

### 4. Vercel (Chỉ cho Frontend, không khuyên dùng cho Backend)

Vercel chủ yếu dành cho frontend và serverless functions. Không khuyên dùng cho NestJS backend.

## Cấu Hình MongoDB Atlas

### Tạo MongoDB Atlas Account

1. Truy cập [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Đăng ký tài khoản miễn phí
3. Tạo organization và project

### Tạo Cluster

1. Click "Build a Database"
2. Chọn FREE tier (M0)
3. Chọn Cloud Provider và Region (gần bạn nhất)
4. Đặt tên cluster và click "Create"

### Tạo Database User

1. Vào "Database Access" trong menu
2. Click "Add New Database User"
3. Chọn "Password" authentication
4. Tạo username và password (lưu lại!)
5. Set role là "Atlas Admin" hoặc "Read and write to any database"
6. Click "Add User"

### Whitelist IP Address

1. Vào "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (thêm `0.0.0.0/0`)
   - Hoặc thêm IP cụ thể của server
4. Click "Confirm"

### Lấy Connection String

1. Vào "Database" → Click "Connect" trên cluster
2. Chọn "Connect your application"
3. Copy connection string
4. Thay `<password>` bằng password của database user
5. Thay `<dbname>` bằng tên database (ví dụ: `user-registration`)

**Ví dụ connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/user-registration?retryWrites=true&w=majority
```

## Cấu Hình Environment Variables

Tạo file `.env` trong thư mục `user-registration-api` (KHÔNG commit lên GitHub):

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=3000
FRONTEND_ORIGIN=https://your-frontend-domain.com
```

## Testing Sau Khi Deploy

1. ✅ API endpoint có thể truy cập: `https://your-api.com`
2. ✅ Health check endpoint hoạt động (nếu có)
3. ✅ Test register user endpoint
4. ✅ Test login endpoint
5. ✅ CORS hoạt động đúng
6. ✅ Database connection thành công

## Troubleshooting

### Lỗi Connection Timeout

- Kiểm tra MongoDB Atlas IP whitelist
- Đảm bảo đã thêm IP của hosting service

### Lỗi CORS

- Kiểm tra `FRONTEND_ORIGIN` đúng chưa
- Đảm bảo không có trailing slash
- Kiểm tra backend logs

### Build Failed

1. Kiểm tra Node.js version (cần 18+)
2. Đảm bảo `package.json` có script `build` và `start:prod`
3. Kiểm tra dependencies có cài đặt đúng không

### Port Issues

Render và Railway tự động set PORT, không cần cấu hình. Chỉ cần đảm bảo code đọc từ `process.env.PORT`.

### Database Connection Failed

1. Kiểm tra MONGO_URI đúng format chưa
2. Kiểm tra password có ký tự đặc biệt (cần URL encode)
3. Kiểm tra network access trên MongoDB Atlas

## GitHub Actions Auto-Deploy

Có 2 workflow files đã được tạo:
- `.github/workflows/deploy-render.yml` - Deploy lên Render
- `.github/workflows/deploy-railway.yml` - Deploy lên Railway

Để sử dụng, cần thêm GitHub Secrets:
- Render: `RENDER_SERVICE_ID`, `RENDER_API_KEY`
- Railway: `RAILWAY_TOKEN`, `RAILWAY_SERVICE`

## Bảo Mật

1. ✅ Không commit file `.env` lên GitHub
2. ✅ Sử dụng environment variables trên hosting platform
3. ✅ Đảm bảo MongoDB password mạnh
4. ✅ Giới hạn IP whitelist nếu có thể
5. ✅ Sử dụng HTTPS (tự động có trên Render/Railway)

## Liên Kết Hữu Ích

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [NestJS Deployment](https://docs.nestjs.com/recipes/deployment)

