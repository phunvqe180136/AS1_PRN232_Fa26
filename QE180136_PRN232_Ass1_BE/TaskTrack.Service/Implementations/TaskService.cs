using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Helpers;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Implementations;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepo;
    public TaskService(ITaskRepository taskRepo) => _taskRepo = taskRepo;

    private static ProjectTaskDto Map(ProjectTask t) => new(
        t.TaskId,
        t.Title,
        t.Description,
        t.Status,
        Enums.TaskStatus.GetValueOrDefault(t.Status),
        t.Priority,
        Enums.TaskPriority.GetValueOrDefault(t.Priority),
        t.DueDate,
        t.ProjectId,
        t.Project?.ProjectName,
        t.IsActive,
        t.CreatedDate,
        t.ModifiedDate,
        (t.Tags ?? new List<Tag>()).Select(tag => new TagBriefDto(tag.TagId, tag.TagName, tag.Color)).ToList());

    public async Task<List<ProjectTaskDto>> GetAllAsync()
    {
        var data = await _taskRepo.GetAllAsync();
        return data.Select(Map).ToList();
    }

    public async Task<ProjectTaskDto?> GetByIdAsync(int id)
    {
        var t = await _taskRepo.GetByIdAsync(id);
        return t is null ? null : Map(t);
    }

    public async Task<List<ProjectTaskDto>> GetByProjectAsync(int projectId)
    {
        var data = await _taskRepo.GetByProjectAsync(projectId);
        return data.Select(Map).ToList();
    }

    public async Task<ProjectTaskDto> CreateAsync(ProjectTaskCreateDto dto)
    {
        var entity = new ProjectTask
        {
            Title = dto.Title.Trim(),
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        var created = await _taskRepo.AddWithTagsAsync(entity, dto.TagIds);
        var reload = await _taskRepo.GetByIdAsync(created.TaskId);
        return Map(reload!);
    }

    public async Task<ProjectTaskDto?> UpdateAsync(int id, ProjectTaskUpdateDto dto)
    {
        var fields = new ProjectTask
        {
            Title = dto.Title.Trim(),
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            IsActive = dto.IsActive
        };

        var updated = await _taskRepo.UpdateWithTagsAsync(id, fields, dto.TagIds);
        if (updated is null) return null;

        var reload = await _taskRepo.GetByIdAsync(id);
        return Map(reload!);
    }

    public async Task<(bool ok, string? error)> DeleteAsync(int id)
    {
        var success = await _taskRepo.SoftDeleteAsync(id);
        return success ? (true, null) : (false, "Task not found.");
    }

    public async Task<List<ProjectTaskDto>> SearchAsync(string? title, short? status, short? priority, int? projectId, int? tagId)
    {
        var data = await _taskRepo.SearchAsync(title, status, priority, projectId, tagId);
        return data.Select(Map).ToList();
    }
}

