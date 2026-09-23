# 🎯 DEPLOY HƯỚNG DẪN — TaskTrack API lên Render

---

## BƯỚC 1: Tạo GitHub Repository

1. Vào **https://github.com/new**
2. Repository name: `TaskTrack-API` (hoặc tên bạn thích)
3. **KHÔNG check** "Add a README file" (vì đã có code rồi)
4. Click **"Create repository"**
5. Ở trang tiếp theo, copy 2 dòng lệnh bên dưới phần "...or push an existing repository from the command line":

```bash
git remote add origin https://github.com/YOUR_USERNAME/TaskTrack-API.git
git branch -M main
git push -u origin main
```

Chạy 2 dòng đó trong thư mục `c:\Users\NTP\Desktop\PRN232_AS1\QE180136_PRN232_Ass1_BE`

---

## BƯỚC 2: Cập nhật render.yaml

Mở file `render.yaml` và sửa dòng `repo` thành URL repo thật của bạn:

```yaml
repo: "https://github.com/YOUR_USERNAME/TaskTrack-API.git"
```

Push lại:
```bash
git add render.yaml
git commit -m "Update render.yaml repo URL"
git push
```

---

## BƯỚC 3: Tạo Web Service trên Render

1. Vào **https://render.com** → Đăng nhập
2. Click **"New +"** → **"Blueprint"**
3. Connect GitHub repo của bạn
4. Render tự đọc `render.yaml` và hiển thị service `tasktrack-api`
5. Click **"Apply"**

---

## BƯỚC 4: Đặt Connection String (RẤT QUAN TRỌNG)

⚠️ Password `Vp160104!@1` chứa `@` và `!` — phải **URL encode** trước khi đặt trong Render!

**Password gốc:** `Vp160104!@1`
**Password đã encode:** `Vp160104%401`

**Connection string đã encode (dùng cho Render):**
```
Host=db.umcqhcxsqcpfozvtforw.supabase.co;Port=6543;Database=postgres;Username=postgres;Password=Vp160104%401;SSL Mode=Require;Trust Server Certificate=true
```

**Trên Render Dashboard:**
1. Vào service `tasktrack-api`
2. Tab **"Environment"**
3. Thêm Environment Variable:

| Key | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | *(paste connection string đã encode ở trên)* |

4. Click **"Save Changes"**

---

## BƯỚC 5: Deploy

Render sẽ tự động build Docker image và deploy. 

- Chờ ~3-5 phút (lần đầu build Docker image)
- Kiểm tra tab **"Logs"** xem progress
- Sau khi deploy thành công, API sẽ chạy ở URL dạng:
  ```
  https://tasktrack-api.onrender.com
  ```

---

## Test API

```bash
curl https://tasktrack-api.onrender.com/api/departments
curl https://tasktrack-api.onrender.com/api/projects
curl https://tasktrack-api.onrender.com/api/stats/summary
```

---

## Swagger
```
https://tasktrack-api.onrender.com/swagger
```
