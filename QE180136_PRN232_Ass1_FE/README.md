# TaskTrack — Frontend (PRN232 Assignment 1)

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Public CRUD UI cho backend TaskTrack API.

## Yêu cầu

- Node.js 18+
- Backend đang chạy (xem `../QE180136_PRN232_Ass1_BE/README.md`)

## Cài đặt local

```bash
npm install
cp .env.example .env.local
# Sửa .env.local: NEXT_PUBLIC_API_URL trỏ về backend của bạn
npm run dev
```

Mở http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Cấu trúc

```
app/
  page.tsx                    # Home
  departments/
    page.tsx                  # List + search
    [id]/page.tsx             # Department detail
    manage/page.tsx           # CRUD
  projects/
    page.tsx                  # List
    [id]/page.tsx             # Project detail
    manage/page.tsx           # CRUD
  tasks/
    page.tsx                  # List
    [id]/page.tsx             # Task detail
    manage/page.tsx           # CRUD (multi-select tags)
  tags/
    manage/page.tsx           # CRUD
  search/page.tsx             # Filter tasks realtime
components/
  Navbar.tsx, PageHeader.tsx, Modal.tsx, Toast.tsx,
  Badges.tsx (status/priority/tag badges), States.tsx
lib/
  api.ts (axios + error), services.ts (typed endpoints),
  types.ts, enums.ts (status/priority labels & colors),
  useAsync.ts, config.ts (NEXT_PUBLIC_API_URL)
```

## Deploy Vercel

1. Push repo FE lên GitHub public.
2. Vercel → New Project → import repo.
3. Framework preset: **Next.js** (auto-detect).
4. Environment Variable: `NEXT_PUBLIC_API_URL` = URL backend Render (vd `https://tasktrack-api.onrender.com`).
5. Deploy → lấy domain Vercel (`https://xxx.vercel.app`) → cập nhật `Cors__AllowedOrigins__0` trên backend Render rồi redeploy.
