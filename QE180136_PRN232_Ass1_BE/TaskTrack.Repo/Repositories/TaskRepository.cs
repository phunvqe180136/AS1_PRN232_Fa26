using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface ITaskRepository : IRepository<ProjectTask>
{
    Task<List<ProjectTask>> GetByProjectAsync(int projectId);
    Task<List<ProjectTask>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId);
    Task<bool> IsTagUsedAsync(int tagId);
    Task<ProjectTask> AddWithTagsAsync(ProjectTask task, List<int>? tagIds);
    Task<ProjectTask?> UpdateWithTagsAsync(int id, ProjectTask updatedFields, List<int>? tagIds);
    Task<bool> SoftDeleteAsync(int id);
}

public class TaskRepository : ITaskRepository
{
    private readonly TaskTrackDbContext _db;
    public TaskRepository(TaskTrackDbContext db) => _db = db;

    public Task<List<ProjectTask>> GetAllAsync() =>
        _db.Tasks.AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.Tags)
            .Where(t => t.IsActive)
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();

    public Task<ProjectTask?> GetByIdAsync(int id) =>
        _db.Tasks.AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.Tags)
            .FirstOrDefaultAsync(t => t.TaskId == id);

    public async Task<ProjectTask> AddAsync(ProjectTask entity)
    {
        _db.Tasks.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<ProjectTask> AddWithTagsAsync(ProjectTask entity, List<int>? tagIds)
    {
        if (tagIds is { Count: > 0 })
        {
            var tags = await _db.Tags.Where(t => tagIds.Contains(t.TagId)).ToListAsync();
            entity.Tags = tags;
        }
        _db.Tasks.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(ProjectTask entity)
    {
        _db.Tasks.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task<ProjectTask?> UpdateWithTagsAsync(int id, ProjectTask updatedFields, List<int>? tagIds)
    {
        var existing = await _db.Tasks
            .Include(t => t.Tags)
            .FirstOrDefaultAsync(t => t.TaskId == id);

        if (existing is null) return null;

        existing.Title = updatedFields.Title;
        existing.Description = updatedFields.Description;
        existing.Status = updatedFields.Status;
        existing.Priority = updatedFields.Priority;
        existing.DueDate = updatedFields.DueDate;
        existing.ProjectId = updatedFields.ProjectId;
        existing.IsActive = updatedFields.IsActive;
        existing.ModifiedDate = DateTime.UtcNow;

        if (tagIds is not null)
        {
            existing.Tags.Clear();
            if (tagIds.Count > 0)
            {
                var newTags = await _db.Tags.Where(t => tagIds.Contains(t.TagId)).ToListAsync();
                foreach (var tag in newTags) existing.Tags.Add(tag);
            }
        }

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        var existing = await _db.Tasks.FirstOrDefaultAsync(t => t.TaskId == id);
        if (existing is null) return false;
        existing.IsActive = false;
        existing.ModifiedDate = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task DeleteAsync(ProjectTask entity)
    {
        _db.Tasks.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public Task<bool> SaveChangesAsync() => _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);

    public Task<List<ProjectTask>> GetByProjectAsync(int projectId) =>
        _db.Tasks.AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.Tags)
            .Where(t => t.ProjectId == projectId && t.IsActive)
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();

    public Task<List<ProjectTask>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId)
    {
        var q = _db.Tasks.AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.Tags)
            .Where(t => t.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(title))
            q = q.Where(t => t.Title.ToLower().Contains(title.ToLower()));
        if (status.HasValue) q = q.Where(t => t.Status == status.Value);
        if (priority.HasValue) q = q.Where(t => t.Priority == priority.Value);
        if (projectId.HasValue) q = q.Where(t => t.ProjectId == projectId.Value);
        if (tagId.HasValue) q = q.Where(t => t.Tags.Any(tag => tag.TagId == tagId.Value));
        return q.OrderByDescending(t => t.CreatedDate).ToListAsync();
    }

    public Task<bool> IsTagUsedAsync(int tagId) =>
        _db.Tasks.AnyAsync(t => t.Tags.Any(tag => tag.TagId == tagId));
}

