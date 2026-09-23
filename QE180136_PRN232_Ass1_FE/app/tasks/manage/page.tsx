'use client';
import { useState } from 'react';
import { Tasks, Projects, Tags } from '@/lib/services';
import { TaskDto, ProjectDto, TagDto, TaskUpsertDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import { TaskStatusOptions, TaskPriorityOptions } from '@/lib/enums';

export default function ManageTasksPage() {
  const list = useAsync(() => Tasks.list(), []);
  const toast = useToast();
  const [editing, setEditing] = useState<TaskDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const refresh = list.refresh;

  return (
    <>
      <PageHeader title="Manage Tasks"
        actions={<button className="btn-primary" onClick={() => setCreating(true)}>+ New Task</button>} />

      {list.loading && <Spinner />}
      {list.data?.length === 0 && <EmptyState title="No tasks" />}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <Th>Title</Th><Th>Project</Th><Th>Status</Th><Th>Priority</Th><Th>Due</Th><Th>Tags</Th><Th>Active</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.data?.map(t => {
              const tId = t.taskId ?? t.taskID!;
              return (
                <tr key={tId}>
                  <Td className="font-medium text-slate-900">{t.title}</Td>
                  <Td>{t.projectName ?? `Project #${t.projectId ?? t.projectID}`}</Td>
                  <Td><TaskStatusBadge value={t.status} /></Td>
                  <Td><PriorityBadge value={t.priority} /></Td>
                  <Td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {t.tags && t.tags.length > 0 ? (
                        t.tags.map(tag => (
                          <TagBadge key={tag.tagId ?? tag.tagID} name={tag.tagName} color={tag.color} />
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <span className={`badge ${t.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-100 text-slate-600 ring-slate-300'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td>
                    <button className="btn-secondary mr-2" onClick={() => setEditing(t)}>Edit</button>
                    <button className="btn-danger" onClick={() => setConfirmId(tId)}>Soft-delete</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {creating && (
        <TaskFormModal title="Create Task" onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh(); }} />
      )}
      {editing && (
        <TaskFormModal title={`Edit Task #${editing.taskId ?? editing.taskID}`} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
      )}
      <ConfirmDialog
        open={confirmId !== null} title="Soft-delete task?" message="The task will be marked as inactive and hidden from active lists, but its data is preserved."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try { await Tasks.remove(confirmId); toast.push('success', 'Task soft-deleted.'); refresh(); }
          catch (e) { toast.push('error', getErrorMessage(e)); }
          finally { setConfirmId(null); }
        }}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{children}</th>;
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-slate-800 ${className}`}>{children}</td>;
}

function TaskFormModal({ title, initial, onClose, onSaved }: { title: string; initial?: TaskDto; onClose: () => void; onSaved: () => void }) {
  const projects = useAsync(() => Projects.list(), []);
  const tags = useAsync(() => Tags.list(), []);
  const toast = useToast();

  const initialProjectId = initial?.projectId ?? initial?.projectID ?? 0;
  const initialTagIds = initial?.tags?.map(t => t.tagId ?? t.tagID!).filter(Boolean) ?? [];

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
    setValues(prev => ({ ...prev, [k]: v }));
  }
  function toggleTag(id: number) {
    const currentTagIds = values.tagIds ?? [];
    setValues(prev => ({
      ...prev,
      tagIds: currentTagIds.includes(id) ? currentTagIds.filter(x => x !== id) : [...currentTagIds, id],
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
    <Modal open={true} onClose={onClose} title={title} footer={
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={async () => {
          if (!validate()) return;
          try {
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
            const targetId = initial ? (initial.taskId ?? initial.taskID!) : undefined;
            if (targetId !== undefined) await Tasks.update(targetId, payload);
            else await Tasks.create(payload);
            toast.push('success', 'Saved.');
            onSaved();
          } catch (e) { toast.push('error', getErrorMessage(e)); }
        }}>{initial ? 'Save changes' : 'Create'}</button>
      </>}>
      <div className="space-y-3">
        <div>
          <label className="label">Title *</label>
          <input className="input" value={values.title} onChange={e => set('title', e.target.value)} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={values.description ?? ''} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Status</label>
            <select className="input" value={values.status} onChange={e => set('status', Number(e.target.value))}>
              {TaskStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={values.priority} onChange={e => set('priority', Number(e.target.value))}>
              {TaskPriorityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Due date</label>
          <input type="date" className="input" value={values.dueDate ? String(values.dueDate).slice(0, 10) : ''} onChange={e => set('dueDate', e.target.value)} />
        </div>
        <div>
          <label className="label">Project *</label>
          <select className="input" value={values.projectId} onChange={e => set('projectId', Number(e.target.value))}>
            <option value="">-- select --</option>
            {projects.data?.map((p: ProjectDto) => {
              const pId = p.projectId ?? p.projectID!;
              return <option key={pId} value={pId}>{p.projectName}</option>;
            })}
          </select>
          {errors.projectId && <p className="mt-1 text-xs text-red-600">{errors.projectId}</p>}
        </div>
        <div>
          <label className="label">Tags (multi-select)</label>
          <div className="mt-1 flex flex-wrap gap-2 rounded-md border border-slate-300 p-2">
            {tags.data?.length === 0 && <span className="text-xs text-slate-500">No tags available.</span>}
            {tags.data?.map((t: TagDto) => {
              const tagId = t.tagId ?? t.tagID!;
              const selected = (values.tagIds ?? []).includes(tagId);
              return (
                <button
                  type="button"
                  key={tagId}
                  onClick={() => toggleTag(tagId)}
                  className={`badge cursor-pointer transition ${
                    selected
                      ? 'bg-indigo-600 text-white ring-indigo-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 ring-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {t.tagName}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="taskActive" checked={values.isActive ?? true} onChange={e => set('isActive', e.target.checked)} />
          <label htmlFor="taskActive" className="text-sm">Active</label>
        </div>
      </div>
    </Modal>
  );
}

