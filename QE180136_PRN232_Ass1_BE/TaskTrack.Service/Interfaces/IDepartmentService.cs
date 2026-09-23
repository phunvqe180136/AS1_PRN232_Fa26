using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface IDepartmentService
{
    Task<List<DepartmentDto>> GetAllAsync();
    Task<DepartmentDetailDto?> GetByIdAsync(int id);
    Task<DepartmentDto> CreateAsync(DepartmentCreateDto dto);
    Task<DepartmentDto?> UpdateAsync(int id, DepartmentUpdateDto dto);
    Task<(bool ok, string? error)> DeleteAsync(int id);
    Task<List<DepartmentDto>> SearchAsync(string name);
}

