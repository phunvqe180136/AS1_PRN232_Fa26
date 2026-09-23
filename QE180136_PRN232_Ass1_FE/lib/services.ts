import {
  DepartmentDto, DepartmentDetailDto, DepartmentUpsertDto,
  ProjectDto, ProjectDetailDto, ProjectUpsertDto,
  TaskDto, TaskUpsertDto,
  TagDto, TagUpsertDto,
  SummaryDto,
} from './types';
import { api } from './api';

export const Departments = {
  list: () => api.get<DepartmentDto[]>('/departments').then(r => r.data),
  get: (id: number) => api.get<DepartmentDetailDto>(`/departments/${id}`).then(r => r.data),
  create: (dto: DepartmentUpsertDto) => api.post<DepartmentDto>('/departments', dto).then(r => r.data),
  update: (id: number, dto: DepartmentUpsertDto) => api.put<DepartmentDto>(`/departments/${id}`, dto).then(r => r.data),
  remove: (id: number) => api.delete(`/departments/${id}`),
  search: (name: string) => api.get<DepartmentDto[]>(`/departments/search?name=${encodeURIComponent(name)}`).then(r => r.data),
};

export const Projects = {
  list: () => api.get<ProjectDto[]>('/projects').then(r => r.data),
  get: (id: number) => api.get<ProjectDetailDto>(`/projects/${id}`).then(r => r.data),
  byDepartment: (departmentId: number) => api.get<ProjectDto[]>(`/projects/department/${departmentId}`).then(r => r.data),
  create: (dto: ProjectUpsertDto) => api.post<ProjectDto>('/projects', dto).then(r => r.data),
  update: (id: number, dto: ProjectUpsertDto) => api.put<ProjectDto>(`/projects/${id}`, dto).then(r => r.data),
  remove: (id: number) => api.delete(`/projects/${id}`),
  search: (params: { name?: string; status?: number; departmentId?: number }) =>
    api.get<ProjectDto[]>('/projects/search', { params }).then(r => r.data),
};

export const Tasks = {
  list: () => api.get<TaskDto[]>('/tasks').then(r => r.data),
  get: (id: number) => api.get<TaskDto>(`/tasks/${id}`).then(r => r.data),
  byProject: (projectId: number) => api.get<TaskDto[]>(`/tasks/project/${projectId}`).then(r => r.data),
  create: (dto: TaskUpsertDto) => api.post<TaskDto>('/tasks', dto).then(r => r.data),
  update: (id: number, dto: TaskUpsertDto) => api.put<TaskDto>(`/tasks/${id}`, dto).then(r => r.data),
  remove: (id: number) => api.delete(`/tasks/${id}`),
  search: (params: { title?: string; status?: number; priority?: number; projectId?: number; tagId?: number }) =>
    api.get<TaskDto[]>('/tasks/search', { params }).then(r => r.data),
};

export const Tags = {
  list: () => api.get<TagDto[]>('/tags').then(r => r.data),
  create: (dto: TagUpsertDto) => api.post<TagDto>('/tags', dto).then(r => r.data),
  update: (id: number, dto: TagUpsertDto) => api.put<TagDto>(`/tags/${id}`, dto).then(r => r.data),
  remove: (id: number) => api.delete(`/tags/${id}`),
};

export const Stats = {
  summary: () => api.get<SummaryDto>('/stats/summary').then(r => r.data),
};
