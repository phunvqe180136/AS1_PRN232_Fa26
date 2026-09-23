using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Implementations;

public class TagService : ITagService
{
    private readonly ITagRepository _repo;
    private readonly ITaskRepository _taskRepo;
    public TagService(ITagRepository repo, ITaskRepository taskRepo)
    {
        _repo = repo;
        _taskRepo = taskRepo;
    }

    private static TagDto Map(Tag t) => new(t.TagId, t.TagName, t.Color);

    public async Task<List<TagDto>> GetAllAsync()
    {
        var data = await _repo.GetAllAsync();
        return data.Select(Map).ToList();
    }

    public async Task<TagDto?> GetByIdAsync(int id)
    {
        var t = await _repo.GetByIdAsync(id);
        return t is null ? null : Map(t);
    }

    public async Task<TagDto> CreateAsync(TagCreateDto dto)
    {
        var entity = new Tag
        {
            TagName = dto.TagName.Trim(),
            Color = dto.Color
        };
        var created = await _repo.AddAsync(entity);
        return Map(created);
    }

    public async Task<TagDto?> UpdateAsync(int id, TagUpdateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return null;
        existing.TagName = dto.TagName.Trim();
        existing.Color = dto.Color;
        await _repo.UpdateAsync(existing);
        return Map(existing);
    }

    public async Task<(bool ok, string? error)> DeleteAsync(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return (false, "Tag not found.");
        if (await _taskRepo.IsTagUsedAsync(id))
            return (false, "Cannot delete: tag is currently used by one or more tasks.");
        await _repo.DeleteAsync(existing);
        return (true, null);
    }
}
