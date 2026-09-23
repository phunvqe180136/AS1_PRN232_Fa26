namespace TaskTrack.Service.DTOs;

public record StatsSummaryDto(
    int TotalDepartments,
    int TotalProjects,
    int TotalTasks,
    int TasksToDo,
    int TasksInProgress,
    int TasksDone,
    int TasksCancelled,
    int OverdueTasks,
    int TotalTags);
