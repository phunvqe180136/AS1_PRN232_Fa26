using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public record DepartmentDto(
    int DepartmentId,
    string DepartmentName,
    string DepartmentDescription,
    bool IsActive,
    int? ProjectCount = null);

public record DepartmentDetailDto(
    int DepartmentId,
    string DepartmentName,
    string DepartmentDescription,
    bool IsActive,
    List<ProjectDto> Projects);

public record DepartmentCreateDto(
    [Required(ErrorMessage = "DepartmentName is required")]
    [StringLength(100, ErrorMessage = "DepartmentName cannot exceed 100 characters")]
    string DepartmentName,

    [Required(ErrorMessage = "DepartmentDescription is required")]
    [StringLength(300, ErrorMessage = "DepartmentDescription cannot exceed 300 characters")]
    string DepartmentDescription);

public record DepartmentUpdateDto(
    [Required(ErrorMessage = "DepartmentName is required")]
    [StringLength(100, ErrorMessage = "DepartmentName cannot exceed 100 characters")]
    string DepartmentName,

    [Required(ErrorMessage = "DepartmentDescription is required")]
    [StringLength(300, ErrorMessage = "DepartmentDescription cannot exceed 300 characters")]
    string DepartmentDescription,

    bool IsActive = true);

