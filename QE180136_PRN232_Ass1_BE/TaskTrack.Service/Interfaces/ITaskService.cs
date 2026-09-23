using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface ITaskService
{
    Task<List<ProjectTaskDto>> GetAllAsync();
    Task<ProjectTaskDto?> GetByIdAsync(int id);
    Task<List<ProjectTaskDto>> GetByProjectAsync(int projectId);
    Task<ProjectTaskDto> CreateAsync(ProjectTaskCreateDto dto);
    Task<ProjectTaskDto?> UpdateAsync(int id, ProjectTaskUpdateDto dto);
    Task<(bool ok, string? error)> DeleteAsync(int id);
    Task<List<ProjectTaskDto>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId);
}
