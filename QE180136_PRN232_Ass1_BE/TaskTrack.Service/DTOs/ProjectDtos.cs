using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public record ProjectDto(
    int ProjectId,
    string ProjectName,
    string? Description,
    DateOnly StartDate,
    DateOnly? EndDate,
    short Status,
    string? StatusName,
    int DepartmentId,
    string? DepartmentName,
    bool IsActive,
    DateTime CreatedDate);

public record ProjectDetailDto(
    int ProjectId,
    string ProjectName,
    string? Description,
    DateOnly StartDate,
    DateOnly? EndDate,
    short Status,
    string? StatusName,
    int DepartmentId,
    string? DepartmentName,
    bool IsActive,
    DateTime CreatedDate,
    List<ProjectTaskDto> Tasks);

public record ProjectCreateDto(
    [Required(ErrorMessage = "ProjectName is required")]
    [StringLength(200, ErrorMessage = "ProjectName cannot exceed 200 characters")]
    string ProjectName,

    string? Description,

    [Required(ErrorMessage = "StartDate is required")]
    DateOnly StartDate,

    DateOnly? EndDate,

    [Range(0, 3, ErrorMessage = "Status must be between 0 and 3")]
    short Status,

    [Required(ErrorMessage = "DepartmentId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "DepartmentId must be a valid ID")]
    int DepartmentId);

public record ProjectUpdateDto(
    [Required(ErrorMessage = "ProjectName is required")]
    [StringLength(200, ErrorMessage = "ProjectName cannot exceed 200 characters")]
    string ProjectName,

    string? Description,

    [Required(ErrorMessage = "StartDate is required")]
    DateOnly StartDate,

    DateOnly? EndDate,

    [Range(0, 3, ErrorMessage = "Status must be between 0 and 3")]
    short Status,

    [Required(ErrorMessage = "DepartmentId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "DepartmentId must be a valid ID")]
    int DepartmentId,

    bool IsActive = true);

