export interface DepartmentDto {
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  isActive: boolean;
  projectCount?: number | null;
  // Legacy aliases
  departmentID?: number;
}

export interface DepartmentDetailDto extends DepartmentDto {
  projects: ProjectDto[];
}

export interface ProjectDto {
  projectId: number;
  projectName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: number;
  statusName?: string | null;
  departmentId: number;
  departmentName?: string | null;
  isActive: boolean;
  createdDate: string;
  // Legacy aliases
  projectID?: number;
  departmentID?: number;
}

export interface ProjectDetailDto extends ProjectDto {
  tasks: TaskDto[];
}

export interface TagBriefDto {
  tagId: number;
  tagName: string;
  color?: string | null;
  // Legacy alias
  tagID?: number;
}

export interface TaskDto {
  taskId: number;
  title: string;
  description?: string | null;
  status: number;
  statusName?: string | null;
  priority: number;
  priorityName?: string | null;
  dueDate?: string | null;
  projectId: number;
  projectName?: string | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string | null;
  tags: TagBriefDto[];
  // Legacy aliases
  taskID?: number;
  projectID?: number;
}

export interface TagDto {
  tagId: number;
  tagName: string;
  color?: string | null;
  // Legacy alias
  tagID?: number;
}

export interface DepartmentUpsertDto {
  departmentName: string;
  departmentDescription: string;
  isActive?: boolean;
}

export interface ProjectUpsertDto {
  projectName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: number;
  departmentId: number;
  isActive?: boolean;
  // Alias for compatibility
  departmentID?: number;
}

export interface TaskUpsertDto {
  title: string;
  description?: string | null;
  status: number;
  priority: number;
  dueDate?: string | null;
  projectId: number;
  isActive?: boolean;
  tagIds?: number[];
  // Aliases for compatibility
  projectID?: number;
  tagIDs?: number[];
}

export interface TagUpsertDto {
  tagName: string;
  color?: string | null;
}

export interface SummaryDto {
  totalDepartments: number;
  totalProjects: number;
  totalTasks: number;
  tasksToDo: number;
  tasksInProgress: number;
  tasksDone: number;
  tasksCancelled: number;
  overdueTasks: number;
  totalTags: number;
  // Fallbacks
  departments?: number;
  projects?: number;
  tasks?: number;
}

