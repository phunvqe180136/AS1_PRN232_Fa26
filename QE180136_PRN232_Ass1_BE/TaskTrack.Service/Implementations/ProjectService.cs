using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Helpers;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Implementations;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repo;
    public ProjectService(IProjectRepository repo) => _repo = repo;

    private static ProjectDto Map(Project p) => new(
        p.ProjectId,
        p.ProjectName,
        p.Description,
        p.StartDate,
        p.EndDate,
        p.Status,
        Enums.ProjectStatus.GetValueOrDefault(p.Status),
        p.DepartmentId,
        p.Department?.DepartmentName,
        p.IsActive,
        p.CreatedDate);

    private static ProjectTaskDto MapTask(ProjectTask t) => new(
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

    public async Task<List<ProjectDto>> GetAllAsync()
    {
        var data = await _repo.GetAllAsync();
        return data.Select(Map).ToList();
    }

    public async Task<ProjectDetailDto?> GetByIdAsync(int id)
    {
        var p = await _repo.GetByIdWithTasksAsync(id);
        if (p is null) return null;
        var tasks = (p.Tasks ?? new List<ProjectTask>())
            .Where(t => t.IsActive)
            .Select(MapTask)
            .ToList();

        return new ProjectDetailDto(
            p.ProjectId,
            p.ProjectName,
            p.Description,
            p.StartDate,
            p.EndDate,
            p.Status,
            Enums.ProjectStatus.GetValueOrDefault(p.Status),
            p.DepartmentId,
            p.Department?.DepartmentName,
            p.IsActive,
            p.CreatedDate,
            tasks);
    }

    public async Task<List<ProjectDto>> GetByDepartmentAsync(int departmentId)
    {
        var data = await _repo.GetByDepartmentAsync(departmentId);
        return data.Select(Map).ToList();
    }

    public async Task<ProjectDto> CreateAsync(ProjectCreateDto dto)
    {
        var entity = new Project
        {
            ProjectName = dto.ProjectName.Trim(),
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            DepartmentId = dto.DepartmentId,
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };
        var created = await _repo.AddAsync(entity);
        var reload = await _repo.GetByIdAsync(created.ProjectId);
        return Map(reload!);
    }

    public async Task<ProjectDto?> UpdateAsync(int id, ProjectUpdateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return null;
        existing.ProjectName = dto.ProjectName.Trim();
        existing.Description = dto.Description;
        existing.StartDate = dto.StartDate;
        existing.EndDate = dto.EndDate;
        existing.Status = dto.Status;
        existing.DepartmentId = dto.DepartmentId;
        existing.IsActive = dto.IsActive;
        await _repo.UpdateAsync(existing);
        var reload = await _repo.GetByIdAsync(id);
        return Map(reload!);
    }

    public async Task<(bool ok, string? error)> DeleteAsync(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return (false, "Project not found.");
        if (await _repo.HasTasksAsync(id))
            return (false, "Cannot delete: project still has active tasks.");
        await _repo.DeleteAsync(existing);
        return (true, null);
    }

    public async Task<List<ProjectDto>> SearchAsync(string? name, short? status, int? departmentId)
    {
        var data = await _repo.SearchAsync(name, status, departmentId);
        return data.Select(Map).ToList();
    }
}

