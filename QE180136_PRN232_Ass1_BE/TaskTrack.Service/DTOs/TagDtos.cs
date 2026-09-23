using System.ComponentModel.DataAnnotations;

namespace TaskTrack.Service.DTOs;

public record TagDto(int TagId, string TagName, string? Color);

public record TagCreateDto(
    [Required(ErrorMessage = "TagName is required")]
    [StringLength(50, ErrorMessage = "TagName cannot exceed 50 characters")]
    string TagName,

    [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Color must be a valid HEX color code (e.g. #3B82F6)")]
    string? Color);

public record TagUpdateDto(
    [Required(ErrorMessage = "TagName is required")]
    [StringLength(50, ErrorMessage = "TagName cannot exceed 50 characters")]
    string TagName,

    [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Color must be a valid HEX color code (e.g. #3B82F6)")]
    string? Color);

