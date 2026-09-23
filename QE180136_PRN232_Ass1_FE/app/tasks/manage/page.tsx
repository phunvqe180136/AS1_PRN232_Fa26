'use client';
import { useState } from 'react';
import { Tasks, Projects, Tags } from '@/lib/services';
import { TaskDto, ProjectDto, TagDto, TaskUpsertDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { SkeletonTable, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import { TaskStatusOptions, TaskPriorityOptions } from '@/lib/enums';
import {
  CheckSquare2,
  PlusCircle,
  Edit2,
  Trash2,
  Calendar,
  FolderKanban,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function ManageTasksPage() {
  const list = useAsync(() => Tasks.list(), []);
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<TaskDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const refresh = list.refresh;

  const filtered = list.data?.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Task Management Hub"
        subtitle="Create, update, tag, and organize company tasks with soft-delete capabilities."
        badge="Task Center"
        action={
          <button
            className="btn-primary text-xs sm:text-sm"
            onClick={() => setCreating(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="input pl-10 text-xs sm:text-sm"
            placeholder="Filter tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered?.length ?? 0} of {list.data?.length ?? 0} tasks
        </div>
      </div>

      {list.loading && <SkeletonTable rows={5} cols={7} />}

      {list.error && (
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <EmptyState
          title="No tasks available"
          hint="Create a new task to start assigning to projects and team members."
          icon={<CheckSquare2 className="h-8 w-8 text-indigo-400" />}
          action={
            <button className="btn-primary" onClick={() => setCreating(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Task
            </button>
          }
        />
      )}

      {filtered && filtered.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-left">Project</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-left">Due Date</th>
                  <th className="px-6 py-4 text-left">Tags</th>
                  <th className="px-6 py-4 text-center">State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((t) => {
                  const tId = t.taskId ?? t.taskID!;
                  return (
                    <tr key={tId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <CheckSquare2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div>{t.title}</div>
                            <div className="text-xs font-normal text-slate-400">#{tId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                          {t.projectName ?? `Project #${t.projectId ?? t.projectID}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <TaskStatusBadge value={t.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PriorityBadge value={t.priority} />
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {t.dueDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(t.dueDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.tags && t.tags.length > 0 ? (
                            t.tags.map((tag) => (
                              <TagBadge
                                key={tag.tagId ?? tag.tagID}
                                name={tag.tagName}
                                color={tag.color}
                              />
                            ))
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            t.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {t.isActive ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-slate-400" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="btn-secondary py-1.5 px-3 text-xs"
                            onClick={() => setEditing(t)}
                          >
                            <Edit2 className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn-danger py-1.5 px-3 text-xs"
                            onClick={() => setConfirmId(tId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Soft-delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {creating && (
        <TaskFormModal
          title="Create Task"
          subtitle="Add a new task item and assign it to a project."
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}

      {editing && (
        <TaskFormModal
          title={`Edit Task #${editing.taskId ?? editing.taskID}`}
          subtitle={`Update details and tags for "${editing.title}"`}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Soft-delete Task?"
        message="The task will be marked as inactive and hidden from active lists, but its data is safely preserved."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try {
            await Tasks.remove(confirmId);
            toast.push('success', 'Task soft-deleted successfully.');
            refresh();
          } catch (e) {
            toast.push('error', getErrorMessage(e));
          } finally {
            setConfirmId(null);
          }
        }}
      />
    </div>
  );
}

function TaskFormModal({
  title,
  subtitle,
  initial,
  onClose,
  onSaved,
}: {
  title: string;
  subtitle?: string;
  initial?: TaskDto;
  onClose: () => void;
  onSaved: () => void;
}) {
  const projects = useAsync(() => Projects.list(), []);
  const tags = useAsync(() => Tags.list(), []);
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const initialProjectId =
    initial?.projectId ?? initial?.projectID ?? projects.data?.[0]?.projectId ?? projects.data?.[0]?.projectID ?? 0;
  const initialTagIds =
    initial?.tags?.map((t) => t.tagId ?? t.tagID!).filter(Boolean) ?? [];

  const [values, setValues] = useState<TaskUpsertDto>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 0,
    priority: initial?.priority ?? 1,
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : undefined,
    projectId: initialProjectId,
    isActive: initial?.isActive ?? true,
    tagIds: initialTagIds,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof TaskUpsertDto>(k: K, v: TaskUpsertDto[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function toggleTag(id: number) {
    const currentTagIds = values.tagIds ?? [];
    setValues((prev) => ({
      ...prev,
      tagIds: currentTagIds.includes(id)
        ? currentTagIds.filter((x) => x !== id)
        : [...currentTagIds, id],
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!values.title.trim()) e.title = 'Title is required';
    if (!values.projectId) e.projectId = 'Project is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={submitting}
            onClick={async () => {
              if (!validate()) return;
              try {
                setSubmitting(true);
                const payload: TaskUpsertDto = {
                  title: values.title.trim(),
                  description: values.description || null,
                  status: Number(values.status),
                  priority: Number(values.priority),
                  dueDate: values.dueDate || null,
                  projectId: Number(values.projectId),
                  isActive: values.isActive ?? true,
                  tagIds: values.tagIds ?? [],
                };
                const targetId = initial
                  ? (initial.taskId ?? initial.taskID!)
                  : undefined;
                if (targetId !== undefined) {
                  await Tasks.update(targetId, payload);
                  toast.push('success', 'Task updated successfully.');
                } else {
                  await Tasks.create(payload);
                  toast.push('success', 'Task created successfully.');
                }
                onSaved();
              } catch (e) {
                toast.push('error', getErrorMessage(e));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Task'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Task Title *</label>
          <input
            className={`input ${errors.title ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
            placeholder="e.g. Implement OAuth login flow"
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-xs font-semibold text-rose-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="Detailed description of the task..."
            value={values.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={values.status}
              onChange={(e) => set('status', Number(e.target.value))}
            >
              {TaskStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select
              className="input"
              value={values.priority}
              onChange={(e) => set('priority', Number(e.target.value))}
            >
              {TaskPriorityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Due Date (Optional)</label>
            <input
              type="date"
              className="input"
              value={values.dueDate ? String(values.dueDate).slice(0, 10) : ''}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Project *</label>
            <select
              className={`input ${errors.projectId ? 'border-rose-500' : ''}`}
              value={values.projectId}
              onChange={(e) => set('projectId', Number(e.target.value))}
            >
              <option value="">-- Select Project --</option>
              {projects.data?.map((p: ProjectDto) => {
                const pId = p.projectId ?? p.projectID!;
                return (
                  <option key={pId} value={pId}>
                    {p.projectName}
                  </option>
                );
              })}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.projectId}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label">Tags (Multi-select)</label>
          <div className="mt-1 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
            {tags.data?.length === 0 && (
              <span className="text-xs text-slate-400">No tags available.</span>
            )}
            {tags.data?.map((t: TagDto) => {
              const tagId = t.tagId ?? t.tagID!;
              const selected = (values.tagIds ?? []).includes(tagId);
              return (
                <button
                  type="button"
                  key={tagId}
                  onClick={() => toggleTag(tagId)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all border ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.tagName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="taskActive"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={values.isActive ?? true}
            onChange={(e) => set('isActive', e.target.checked)}
          />
          <label
            htmlFor="taskActive"
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            Active Task (visible in active boards and lists)
          </label>
        </div>
      </div>
    </Modal>
  );
}
