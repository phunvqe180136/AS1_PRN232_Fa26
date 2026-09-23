using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo.Models;

namespace TaskTrack.Repo.Repositories;

public interface ITagRepository : IRepository<Tag>
{
    Task<Tag?> GetByNameAsync(string name);
}

public class TagRepository : ITagRepository
{
    private readonly TaskTrackDbContext _db;
    public TagRepository(TaskTrackDbContext db) => _db = db;

    public Task<List<Tag>> GetAllAsync() =>
        _db.Tags.AsNoTracking().OrderBy(t => t.TagId).ToListAsync();

    public Task<Tag?> GetByIdAsync(int id) =>
        _db.Tags.AsNoTracking().FirstOrDefaultAsync(t => t.TagId == id);

    public async Task<Tag> AddAsync(Tag entity)
    {
        _db.Tags.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Tag entity)
    {
        _db.Tags.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Tag entity)
    {
        _db.Tags.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public Task<bool> SaveChangesAsync() => _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);

    public Task<Tag?> GetByNameAsync(string name) =>
        _db.Tags.AsNoTracking().FirstOrDefaultAsync(t => t.TagName.ToLower() == name.ToLower());
}
