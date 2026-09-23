namespace TaskTrack.Service.Helpers;

public static class Enums
{
    public static readonly Dictionary<short, string> ProjectStatus = new()
    {
        { 0, "Not Started" }, { 1, "In Progress" }, { 2, "Completed" }, { 3, "On Hold" }
    };

    public static readonly Dictionary<short, string> TaskStatus = new()
    {
        { 0, "To Do" }, { 1, "In Progress" }, { 2, "Done" }, { 3, "Cancelled" }
    };

    public static readonly Dictionary<short, string> TaskPriority = new()
    {
        { 0, "Low" }, { 1, "Medium" }, { 2, "High" }, { 3, "Critical" }
    };
}
