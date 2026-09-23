using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public record TagBriefDto(int TagId, string TagName, string? Color);

public record ProjectTaskDto(
    int TaskId,
    string Title,
    string? Description,
    short Status,
    string? StatusName,
    short Priority,
    string? PriorityName,
    DateOnly? DueDate,
    int ProjectId,
    string? ProjectName,
    bool IsActive,
    DateTime CreatedDate,
    DateTime? ModifiedDate,
    List<TagBriefDto> Tags);

public record ProjectTaskCreateDto(
    [Required(ErrorMessage = "Title is required")]
    [StringLength(300, ErrorMessage = "Title cannot exceed 300 characters")]
    string Title,

    string? Description,

    [Range(0, 3, ErrorMessage = "Status must be between 0 and 3")]
    short Status,

    [Range(0, 3, ErrorMessage = "Priority must be between 0 and 3")]
    short Priority,

    DateOnly? DueDate,

    [Required(ErrorMessage = "ProjectId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "ProjectId must be a valid ID")]
    int ProjectId,

    List<int>? TagIds);

public record ProjectTaskUpdateDto(
    [Required(ErrorMessage = "Title is required")]
    [StringLength(300, ErrorMessage = "Title cannot exceed 300 characters")]
    string Title,

    string? Description,

    [Range(0, 3, ErrorMessage = "Status must be between 0 and 3")]
    short Status,

    [Range(0, 3, ErrorMessage = "Priority must be between 0 and 3")]
    short Priority,

    DateOnly? DueDate,

    [Required(ErrorMessage = "ProjectId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "ProjectId must be a valid ID")]
    int ProjectId,

    bool IsActive = true,

    List<int>? TagIds = null);

