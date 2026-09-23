# Hướng dẫn tạo Supabase & chạy SQL

> Supabase cung cấp PostgreSQL managed, dùng thay cho PostgreSQL trên Render trong bài Assignment 1.

## 1. Tạo project

1. Vào https://supabase.com → đăng nhập → **New Project**
2. Đặt tên: `prn232-taskmanagement` (hoặc tùy ý)
3. Chọn **Database Password** mạnh → **LƯU LẠI** (chỉ hiển thị 1 lần)
4. Region chọn **Singapore** (gần VN)
5. Plan: **Free** → Create project (chờ ~2 phút)

## 2. Chạy file `TaskManagementDB_Postgres.sql`

Vào **SQL Editor** (icon bảng tính bên trái) → **New query** → paste toàn bộ nội dung file → nhấn **Run** (Ctrl+Enter).

Sau khi chạy xong, vào **Table Editor** kiểm tra có 5 bảng:
- Department, Project, Task, Tag, TaskTag

## 3. Lấy Connection String (dùng cho backend .NET)

Vào **Settings** (⚙️) → **Database** → mục **Connection string** → chọn tab **URI**.

Có 2 lựa chọn:

### Option A — Direct connection (port 5432) — dùng cho local dev
```
postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```
Chuyển sang dạng key-value cho Npgsql:
```
Host=aws-0-ap-southeast-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.[ref];Password=[password];SSL Mode=Require;Trust Server Certificate=true
```

### Option B — Transaction Pooler (port 6543) — dùng cho production / Render
```
postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```
→ dạng key-value:
```
Host=aws-0-ap-southeast-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.[ref];Password=[password];SSL Mode=Require;Trust Server Certificate=true
```

> 💡 **Khuyến nghị**: dùng **Transaction Pooler (port 6543)** cho cả local lẫn prod để tránh lỗi "too many connections".

## 4. Tắt Row-Level Security (RLS) cho public CRUD

Vì bài này API là **public, không cần auth**, cần tắt RLS để truy vấn thông thường không bị chặn.

Vào **SQL Editor** → chạy:
```sql
ALTER TABLE "Department" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Project"   DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Task"      DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag"       DISABLE ROW LEVEL SECURITY;
ALTER TABLE "TaskTag"   DISABLE ROW LEVEL SECURITY;
```

## 5. Test connection từ terminal (tùy chọn)

Nếu có `psql`:
```bash
psql "postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```
Chạy `\dt` để liệt kê bảng.

## 6. Điền connection string vào `appsettings.json`

```jsonc
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=aws-0-ap-southeast-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.<REF>;Password=<PASSWORD>;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

**Không commit password thật lên GitHub** — dùng Environment Variable khi deploy:
- Trên Render: set `ConnectionStrings__DefaultConnection` thay vì để trong appsettings.
- Khi dev local: dùng `appsettings.Development.json` (đã có trong .gitignore mặc định).
