using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface ITagService
{
    Task<List<TagDto>> GetAllAsync();
    Task<TagDto?> GetByIdAsync(int id);
    Task<TagDto> CreateAsync(TagCreateDto dto);
    Task<TagDto?> UpdateAsync(int id, TagUpdateDto dto);
    Task<(bool ok, string? error)> DeleteAsync(int id);
}
