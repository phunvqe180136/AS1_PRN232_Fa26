# TaskTrack — Backend (PRN232 Assignment 1)

ASP.NET Core Web API (.NET 8) + Entity Framework Core + PostgreSQL (Supabase).
Solution gồm 3 projects:

| Project | Vai trò |
|---|---|
| `TaskTrack.API` | Controllers, `Program.cs`, `appsettings.json`, Swagger, CORS |
| `TaskTrack.Repo` | EF Core entities, `DbContext`, Repository layer |
| `TaskTrack.Service` | Service interfaces + implementations + DTOs |

## Yêu cầu

- .NET SDK 8.0+
- PostgreSQL (Render hoặc Supabase). Xem `../SUPABASE_SETUP.md` để cấu hình Supabase.

## Cấu hình local

1. Sửa connection string trong `TaskTrack.API/appsettings.Development.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=taskmanagement;Username=postgres;Password=postgres"
   }
   ```
2. Chạy file `../TaskManagementDB_Postgres.sql` trên database của bạn (SQL Editor trên Supabase hoặc `psql`).
3. Restore + run:
   ```bash
   dotnet restore
   dotnet run --project TaskTrack.API
   ```
4. Mở Swagger tại `http://localhost:5149/swagger`.

## Cấu trúc thư mục

```
TaskTrack.API/
  Controllers/      # DepartmentsController, ProjectsController, TasksController, TagsController, StatsController
  Program.cs        # Wire-up DI, EF, CORS, Swagger
  appsettings.json
TaskTrack.Repo/
  Models/           # Department, Project, ProjectTask, Tag (DbSet: Tasks)
  Repositories/     # GenericRepository + 4 entity-specific repositories
  TaskTrackDbContext.cs
TaskTrack.Service/
  DTOs/             # DepartmentDtos, ProjectDtos, TaskDtos, TagDtos
  Interfaces/       # IDepartmentService, IProjectService, ITaskService, ITagService
  Implementations/  # Services.cs (4 service classes)
  Helpers/          # Enums
```

## API Endpoints

- `GET    /api/departments`
- `GET    /api/departments/{id}`
- `POST   /api/departments`
- `PUT    /api/departments/{id}`
- `DELETE /api/departments/{id}` — 400 nếu còn project
- `GET    /api/departments/search?name=`

- `GET    /api/projects`
- `GET    /api/projects/{id}`
- `GET    /api/projects/department/{departmentId}`
- `POST   /api/projects`
- `PUT    /api/projects/{id}`
- `DELETE /api/projects/{id}` — 400 nếu còn task
- `GET    /api/projects/search?name=&status=&departmentId=`

- `GET    /api/tasks`
- `GET    /api/tasks/{id}`
- `GET    /api/tasks/project/{projectId}`
- `POST   /api/tasks` — nhận optional `tagIDs[]`
- `PUT    /api/tasks/{id}` — set `ModifiedDate = now`, thay tags
- `DELETE /api/tasks/{id}` — soft-delete (IsActive=false)
- `GET    /api/tasks/search?title=&status=&priority=&projectId=&tagId=`

- `GET    /api/tags`
- `POST   /api/tags`
- `PUT    /api/tags/{id}`
- `DELETE /api/tags/{id}` — 400 nếu đang dùng

- `GET    /api/stats/summary` — Home dashboard counts

## Deploy Render.com

1. Push repo lên GitHub public.
2. Render → New Web Service → chọn repo → **Environment: Docker** không cần (chọn .NET).
3. Build command: `dotnet publish -c Release -o ./publish`
4. Start command: `cd publish && dotnet TaskTrack.API.dll`
5. Environment Variables:
   - `ASPNETCORE_ENVIRONMENT=Production`
   - `ConnectionStrings__DefaultConnection=<Npgsql key-value của Supabase>`
   - `Cors__AllowedOrigins__0=https://<your-app>.vercel.app`
6. Health check path: `/`.
