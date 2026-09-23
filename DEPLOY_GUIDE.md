# 🎯 HƯỚNG DẪN DEPLOY TOÀN DIỆN — PRN232 ASSIGNMENT 1

> **Sinh viên**: Nguyen Van Phu (PhuNVQE180136)  
> **GitHub Repo**: [https://github.com/phunvqe180136/AS1_PRN232_Fa26](https://github.com/phunvqe180136/AS1_PRN232_Fa26)

---

## 🔗 Danh Sách Toàn Bộ Links Dự Án

| Tên Dịch Vụ | Loại | Đường Dẫn (Link) |
|---|---|---|
| 🐙 **GitHub Repository** | Mã nguồn chính | [https://github.com/phunvqe180136/AS1_PRN232_Fa26](https://github.com/phunvqe180136/AS1_PRN232_Fa26) |
| 🌐 **Frontend (Vercel)** | Ứng dụng Next.js Live | [https://taskminder-qe180136.vercel.app](https://taskminder-qe180136.vercel.app) |
| 🔌 **Backend (Render)** | REST API & Swagger UI | [https://tasktrack-api-qe180136.onrender.com/swagger](https://tasktrack-api-qe180136.onrender.com/swagger) |
| 🗄️ **PostgreSQL Script** | DB Schema & Seed Data | [`TaskManagementDB_Postgres.sql`](./TaskManagementDB_Postgres.sql) |

---

## 🗄️ BƯỚC 1: Khởi Tạo PostgreSQL Database

### Lựa chọn A: Tạo trực tiếp trên Render (Khuyên dùng)
1. Đăng nhập [dashboard.render.com](https://dashboard.render.com/)
2. Bấm **New +** → Chọn **PostgreSQL**
3. Cấu hình:
   - **Name**: `tasktrack-db`
   - **Database**: `tasktrack_db`
   - **User**: `tasktrack_user`
   - **Region**: `Singapore`
   - **Plan**: `Free`
4. Bấm **Create Database**.
5. Sau khi tạo xong, copy **External Database URL** (hoặc Internal Database URL nếu cùng Render).

### Lựa chọn B: Dùng Supabase
Xem hướng dẫn chi tiết tại [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

### 📥 Thực thi Script tạo bảng & nạp dữ liệu:
- Mở **DBeaver** / **pgAdmin** / **Supabase SQL Editor**, kết nối đến DB vừa tạo.
- Mở file [`TaskManagementDB_Postgres.sql`](./TaskManagementDB_Postgres.sql), chạy toàn bộ script để khởi tạo các bảng và dữ liệu mẫu.

---

## ⚙️ BƯỚC 2: Deploy Backend (.NET 8 Web API) lên Render.com

1. Vào [dashboard.render.com](https://dashboard.render.com/) → Bấm **New +** → Chọn **Web Service**.
2. Chọn repo GitHub: `https://github.com/phunvqe180136/AS1_PRN232_Fa26`
3. Cài đặt các trường:
   - **Name**: `tasktrack-api-qe180136`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `QE180136_PRN232_Ass1_BE` *(⚠️ Bắt buộc)*
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: `Free`
4. Thêm các biến môi trường tại tab **Environment**:

| Key | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | `Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true` |

5. Bấm **Create Web Service**. Chờ Render build Docker image (~2-4 phút).
6. Kiểm tra Swagger tại: `https://tasktrack-api-qe180136.onrender.com/swagger`

---

## 🌐 BƯỚC 3: Deploy Frontend (Next.js 14) lên Vercel

1. Đăng nhập [vercel.com](https://vercel.com/) bằng tài khoản GitHub.
2. Bấm **Add New...** → **Project** → Chọn repo `AS1_PRN232_Fa26`.
3. Cấu hình cài đặt:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Chọn `QE180136_PRN232_Ass1_FE`
4. Thêm biến môi trường:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://tasktrack-api-qe180136.onrender.com/api` |

5. Bấm **Deploy**. Sau ~1 phút trang web sẽ online tại domain Vercel của bạn.
