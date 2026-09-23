namespace TaskTrack.Repo.Models;

// Entity class đặt tên là ProjectTask để tránh trùng với System.Threading.Tasks.Task
// Map sang table "Task" trong PostgreSQL
public class ProjectTask
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public short Status { get; set; }      // 0=To Do, 1=In Progress, 2=Done, 3=Cancelled
    public short Priority { get; set; }    // 0=Low, 1=Medium, 2=High, 3=Critical
    public DateOnly? DueDate { get; set; }
    public int ProjectId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }

    public Project? Project { get; set; }
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
