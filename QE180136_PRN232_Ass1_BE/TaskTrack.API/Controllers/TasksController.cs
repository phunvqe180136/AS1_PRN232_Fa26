using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _svc;
    public TasksController(ITaskService svc) => _svc = svc;

    [HttpGet]
    public async Task<ActionResult<List<ProjectTaskDto>>> GetAll() =>
        Ok(await _svc.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProjectTaskDto>> GetById(int id)
    {
        var t = await _svc.GetByIdAsync(id);
        return t is null ? NotFound() : Ok(t);
    }

    [HttpGet("project/{projectId:int}")]
    public async Task<ActionResult<List<ProjectTaskDto>>> GetByProject(int projectId) =>
        Ok(await _svc.GetByProjectAsync(projectId));

    [HttpPost]
    public async Task<ActionResult<ProjectTaskDto>> Create(ProjectTaskCreateDto dto)
    {
        var created = await _svc.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.TaskId }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProjectTaskDto>> Update(int id, ProjectTaskUpdateDto dto)
    {
        var updated = await _svc.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (ok, error) = await _svc.DeleteAsync(id);
        return ok ? NoContent() : BadRequest(new { error });
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<ProjectTaskDto>>> Search(
        [FromQuery] string? title,
        [FromQuery] short? status,
        [FromQuery] short? priority,
        [FromQuery] int? projectId,
        [FromQuery] int? tagId) =>
        Ok(await _svc.SearchAsync(title, status, priority, projectId, tagId));
}
