using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo;

public class TaskTrackDbContext : DbContext
{
    public TaskTrackDbContext(DbContextOptions<TaskTrackDbContext> options) : base(options) { }

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTask> Tasks => Set<ProjectTask>();
    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // ---- Department ----
        b.Entity<Department>(e =>
        {
            e.ToTable("Department");
            e.HasKey(x => x.DepartmentId);
            e.Property(x => x.DepartmentId).HasColumnName("DepartmentID");
            e.Property(x => x.DepartmentName).HasColumnName("DepartmentName").HasMaxLength(100).IsRequired();
            e.Property(x => x.DepartmentDescription).HasColumnName("DepartmentDescription").HasMaxLength(300).IsRequired();
            e.Property(x => x.IsActive).HasColumnName("IsActive");
        });

        // ---- Project ----
        b.Entity<Project>(e =>
        {
            e.ToTable("Project");
            e.HasKey(x => x.ProjectId);
            e.Property(x => x.ProjectId).HasColumnName("ProjectID");
            e.Property(x => x.ProjectName).HasColumnName("ProjectName").HasMaxLength(200).IsRequired();
            e.Property(x => x.Description).HasColumnName("Description");
            e.Property(x => x.StartDate).HasColumnName("StartDate");
            e.Property(x => x.EndDate).HasColumnName("EndDate");
            e.Property(x => x.Status).HasColumnName("Status");
            e.Property(x => x.DepartmentId).HasColumnName("DepartmentID");
            e.Property(x => x.IsActive).HasColumnName("IsActive");
            e.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            e.HasOne(x => x.Department).WithMany(d => d.Projects).HasForeignKey(x => x.DepartmentId)
                .HasConstraintName("FK_Project_Department");
        });

        // ---- Task (entity class: ProjectTask) ----
        b.Entity<ProjectTask>(e =>
        {
            e.ToTable("Task");
            e.HasKey(x => x.TaskId);
            e.Property(x => x.TaskId).HasColumnName("TaskID");
            e.Property(x => x.Title).HasColumnName("Title").HasMaxLength(300).IsRequired();
            e.Property(x => x.Description).HasColumnName("Description");
            e.Property(x => x.Status).HasColumnName("Status");
            e.Property(x => x.Priority).HasColumnName("Priority");
            e.Property(x => x.DueDate).HasColumnName("DueDate");
            e.Property(x => x.ProjectId).HasColumnName("ProjectID");
            e.Property(x => x.IsActive).HasColumnName("IsActive");
            e.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            e.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            e.HasOne(x => x.Project).WithMany(p => p.Tasks).HasForeignKey(x => x.ProjectId)
                .HasConstraintName("FK_Task_Project");
        });

        // ---- Tag ----
        b.Entity<Tag>(e =>
        {
            e.ToTable("Tag");
            e.HasKey(x => x.TagId);
            e.Property(x => x.TagId).HasColumnName("TagID");
            e.Property(x => x.TagName).HasColumnName("TagName").HasMaxLength(50).IsRequired();
            e.Property(x => x.Color).HasColumnName("Color").HasMaxLength(7);
        });

        // ---- Task <-> Tag (many-to-many qua bảng TaskTag) ----
        b.Entity<ProjectTask>()
            .HasMany(t => t.Tags)
            .WithMany(t => t.Tasks)
            .UsingEntity<Dictionary<string, object>>(
                "TaskTag",
                right => right.HasOne<Tag>().WithMany().HasForeignKey("TagID")
                    .HasConstraintName("FK_TaskTag_Tag"),
                left => left.HasOne<ProjectTask>().WithMany().HasForeignKey("TaskID")
                    .HasConstraintName("FK_TaskTag_Task"),
                join =>
                {
                    join.ToTable("TaskTag");
                    join.HasKey("TaskID", "TagID");
                });
    }
}
