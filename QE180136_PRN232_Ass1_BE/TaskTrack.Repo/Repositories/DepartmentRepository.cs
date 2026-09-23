using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface IDepartmentRepository : IRepository<Department>
{
    Task<Department?> GetByIdWithProjectsAsync(int id);
    Task<List<Department>> SearchByNameAsync(string name);
    Task<bool> HasProjectsAsync(int departmentId);
}

public class DepartmentRepository : IDepartmentRepository
{
    private readonly TaskTrackDbContext _db;
    public DepartmentRepository(TaskTrackDbContext db) => _db = db;

    public Task<List<Department>> GetAllAsync() =>
        _db.Departments.AsNoTracking()
            .Include(d => d.Projects.Where(p => p.IsActive))
            .Where(d => d.IsActive)
            .OrderBy(d => d.DepartmentId)
            .ToListAsync();

    public Task<Department?> GetByIdAsync(int id) =>
        _db.Departments.AsNoTracking().FirstOrDefaultAsync(d => d.DepartmentId == id);

    public Task<Department?> GetByIdWithProjectsAsync(int id) =>
        _db.Departments.AsNoTracking()
            .Include(d => d.Projects.Where(p => p.IsActive))
            .FirstOrDefaultAsync(d => d.DepartmentId == id);

    public async Task<Department> AddAsync(Department entity)
    {
        _db.Departments.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Department entity)
    {
        _db.Departments.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Department entity)
    {
        _db.Departments.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public Task<bool> SaveChangesAsync() => _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);

    public Task<List<Department>> SearchByNameAsync(string name) =>
        _db.Departments.AsNoTracking()
            .Include(d => d.Projects.Where(p => p.IsActive))
            .Where(d => d.IsActive && d.DepartmentName.ToLower().Contains(name.ToLower()))
            .OrderBy(d => d.DepartmentId)
            .ToListAsync();

    public Task<bool> HasProjectsAsync(int departmentId) =>
        _db.Projects.AnyAsync(p => p.DepartmentId == departmentId && p.IsActive);
}

