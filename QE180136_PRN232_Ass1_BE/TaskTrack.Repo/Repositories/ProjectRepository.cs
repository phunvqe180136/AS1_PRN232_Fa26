using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IProjectRepository : IRepository<Project>
{
    Task<Project?> GetByIdWithTasksAsync(int id);
    Task<List<Project>> GetByDepartmentAsync(int departmentId);
    Task<bool> HasTasksAsync(int projectId);
    Task<List<Project>> SearchAsync(string? name, short? status, int? departmentId);
}

public class ProjectRepository : IProjectRepository
{
    private readonly TaskTrackDbContext _db;
    public ProjectRepository(TaskTrackDbContext db) => _db = db;

    public Task<List<Project>> GetAllAsync() =>
        _db.Projects.AsNoTracking()
            .Include(p => p.Department)
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.CreatedDate)
            .ToListAsync();

    public Task<Project?> GetByIdAsync(int id) =>
        _db.Projects.AsNoTracking()
            .Include(p => p.Department)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

    public Task<Project?> GetByIdWithTasksAsync(int id) =>
        _db.Projects.AsNoTracking()
            .Include(p => p.Department)
            .Include(p => p.Tasks.Where(t => t.IsActive))
                .ThenInclude(t => t.Tags)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

    public async Task<Project> AddAsync(Project entity)
    {
        _db.Projects.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Project entity)
    {
        _db.Projects.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Project entity)
    {
        _db.Projects.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public Task<bool> SaveChangesAsync() => _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);

    public Task<List<Project>> GetByDepartmentAsync(int departmentId) =>
        _db.Projects.AsNoTracking()
            .Include(p => p.Department)
            .Where(p => p.DepartmentId == departmentId && p.IsActive)
            .OrderByDescending(p => p.CreatedDate)
            .ToListAsync();

    public Task<bool> HasTasksAsync(int projectId) =>
        _db.Tasks.AnyAsync(t => t.ProjectId == projectId && t.IsActive);

    public Task<List<Project>> SearchAsync(string? name, short? status, int? departmentId)
    {
        var q = _db.Projects.AsNoTracking()
            .Include(p => p.Department)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            q = q.Where(p => p.ProjectName.ToLower().Contains(name.ToLower()));
        if (status.HasValue) q = q.Where(p => p.Status == status.Value);
        if (departmentId.HasValue) q = q.Where(p => p.DepartmentId == departmentId.Value);
        return q.OrderByDescending(p => p.CreatedDate).ToListAsync();
    }
}

