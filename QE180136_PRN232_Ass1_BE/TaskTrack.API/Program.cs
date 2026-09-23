using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.Implementations;
using TaskTrack.Service.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ---------- DB ----------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["DATABASE_URL"]
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection not configured.");

builder.Services.AddDbContext<TaskTrackDbContext>(opts =>
    opts.UseNpgsql(connectionString));

// ---------- Repositories ----------
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();

// ---------- Services ----------
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<IStatsService, StatsService>();

// ---------- MVC + Swagger ----------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TaskTrack API",
        Version = "v1",
        Description = "Task & Team Management Web API - PRN232 Assignment 1"
    });
});

// ---------- CORS for Vercel & Localhost ----------
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Enable Swagger in development and production (for assignment grading)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskTrack API v1");
    c.RoutePrefix = string.Empty; // Swagger UI served at root URL as well
});

app.UseCors("AllowFrontend");
app.MapControllers();
app.MapGet("/api", () => Results.Ok(new { name = "TaskTrack API", status = "running", version = "v1" }));

app.Run();

