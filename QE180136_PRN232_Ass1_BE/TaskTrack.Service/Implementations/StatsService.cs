using Microsoft.EntityFrameworkCore;
using TaskTrack.Repo;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.Service.Implementations;

public class StatsService : IStatsService
{
    private readonly TaskTrackDbContext _db;
    public StatsService(TaskTrackDbContext db) => _db = db;

    public async Task<StatsSummaryDto> GetSummaryAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var departments = await _db.Departments.CountAsync();
        var projects = await _db.Projects.CountAsync(p => p.IsActive);
        var tasks = await _db.Tasks.Where(t => t.IsActive).ToListAsync();
        var tags = await _db.Tags.CountAsync();

        return new StatsSummaryDto(
            TotalDepartments: departments,
            TotalProjects: projects,
            TotalTasks: tasks.Count,
            TasksToDo: tasks.Count(t => t.Status == 0),
            TasksInProgress: tasks.Count(t => t.Status == 1),
            TasksDone: tasks.Count(t => t.Status == 2),
            TasksCancelled: tasks.Count(t => t.Status == 3),
            OverdueTasks: tasks.Count(t => t.DueDate.HasValue && t.DueDate < today && t.Status != 2 && t.Status != 3),
            TotalTags: tags);
    }
}
