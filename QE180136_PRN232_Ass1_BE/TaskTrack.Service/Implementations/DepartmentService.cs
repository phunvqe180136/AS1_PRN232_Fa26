using TaskTrack.Repo.Models;
using TaskTrack.Repo.Repositories;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Helpers;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Implementations;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repo;
    public DepartmentService(IDepartmentRepository repo) => _repo = repo;

    private static DepartmentDto Map(Department d) =>
        new(d.DepartmentId, d.DepartmentName, d.DepartmentDescription, d.IsActive, d.Projects?.Count(p => p.IsActive));

    private static ProjectDto MapProject(Project p) => new(
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

    public async Task<List<DepartmentDto>> GetAllAsync()
    {
        var data = await _repo.GetAllAsync();
        return data.Select(Map).ToList();
    }

    public async Task<DepartmentDetailDto?> GetByIdAsync(int id)
    {
        var d = await _repo.GetByIdWithProjectsAsync(id);
        if (d is null) return null;
        var projects = (d.Projects ?? new List<Project>())
            .Where(p => p.IsActive)
            .Select(MapProject)
            .ToList();
        return new DepartmentDetailDto(d.DepartmentId, d.DepartmentName, d.DepartmentDescription, d.IsActive, projects);
    }

    public async Task<DepartmentDto> CreateAsync(DepartmentCreateDto dto)
    {
        var entity = new Department
        {
            DepartmentName = dto.DepartmentName.Trim(),
            DepartmentDescription = dto.DepartmentDescription.Trim(),
            IsActive = true
        };
        var created = await _repo.AddAsync(entity);
        return Map(created);
    }

    public async Task<DepartmentDto?> UpdateAsync(int id, DepartmentUpdateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return null;
        existing.DepartmentName = dto.DepartmentName.Trim();
        existing.DepartmentDescription = dto.DepartmentDescription.Trim();
        existing.IsActive = dto.IsActive;
        await _repo.UpdateAsync(existing);
        return Map(existing);
    }

    public async Task<(bool ok, string? error)> DeleteAsync(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return (false, "Department not found.");
        if (await _repo.HasProjectsAsync(id))
            return (false, "Cannot delete: department still has active projects.");
        await _repo.DeleteAsync(existing);
        return (true, null);
    }

    public async Task<List<DepartmentDto>> SearchAsync(string name)
    {
        var data = await _repo.SearchByNameAsync(name);
        return data.Select(Map).ToList();
    }
}

