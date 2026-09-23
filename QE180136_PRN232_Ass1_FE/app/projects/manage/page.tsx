'use client';
import { useState } from 'react';
import { Projects, Departments } from '@/lib/services';
import { ProjectDto, ProjectUpsertDto, DepartmentDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { SkeletonTable, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';
import { StatusBadge } from '@/components/Badges';
import { ProjectStatusOptions } from '@/lib/enums';
import {
  FolderKanban,
  PlusCircle,
  Edit2,
  Trash2,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';

export default function ManageProjectsPage() {
  const list = useAsync(() => Projects.list(), []);
  const departments = useAsync(() => Departments.list(), []);
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<ProjectDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const refresh = list.refresh;

  const filtered = list.data?.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Project Management"
        subtitle="Configure, track, and maintain all corporate projects and departmental initiatives."
        badge="Admin Hub"
        action={
          <button
            className="btn-primary text-xs sm:text-sm"
            onClick={() => setCreating(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Project</span>
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
            placeholder="Filter projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered?.length ?? 0} of {list.data?.length ?? 0} projects
        </div>
      </div>

      {list.loading && <SkeletonTable rows={5} cols={7} />}

      {list.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <EmptyState
          title="No projects available"
          hint="Create a new project to start scheduling tasks and assigning teams."
          icon={<FolderKanban className="h-8 w-8 text-violet-400" />}
          action={
            <button className="btn-primary" onClick={() => setCreating(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Project
            </button>
          }
        />
      )}

      {filtered && filtered.length > 0 && (
        <div className="card-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800">
              <thead className="bg-slate-50/70 dark:bg-slate-900/70 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Project</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-left">Timeline</th>
                  <th className="px-6 py-4 text-center">State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filtered.map((p) => {
                  const pId = p.projectId ?? p.projectID!;
                  return (
                    <tr
                      key={pId}
                      className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                            <FolderKanban className="h-4 w-4" />
                          </div>
                          <div>
                            <div>{p.projectName}</div>
                            <div className="text-xs font-normal text-slate-400">ID #{pId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          {p.departmentName ?? `Dept #${p.departmentId ?? p.departmentID}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge value={p.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{new Date(p.startDate).toLocaleDateString()}</span>
                        </div>
                        {p.endDate && (
                          <div className="text-slate-400 mt-0.5">
                            End: {new Date(p.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {p.isActive ? (
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
                            onClick={() => setEditing(p)}
                          >
                            <Edit2 className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn-danger py-1.5 px-3 text-xs"
                            onClick={() => setConfirmId(pId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
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
        <ProjectFormModal
          title="Create Project"
          subtitle="Add a new project to your department portfolio."
          departments={departments.data ?? []}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}

      {editing && (
        <ProjectFormModal
          title={`Edit Project #${editing.projectId ?? editing.projectID}`}
          subtitle={`Update details for ${editing.projectName}`}
          initial={editing}
          departments={departments.data ?? []}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Project?"
        message="This will permanently delete this project. Any associated tasks must be deleted or reassigned first."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try {
            await Projects.remove(confirmId);
            toast.push('success', 'Project deleted successfully.');
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

function ProjectFormModal({
  title,
  subtitle,
  initial,
  departments,
  onClose,
  onSaved,
}: {
  title: string;
  subtitle?: string;
  initial?: ProjectDto;
  departments: DepartmentDto[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const initialDeptId =
    initial?.departmentId ??
    initial?.departmentID ??
    departments[0]?.departmentId ??
    departments[0]?.departmentID ??
    0;

  const [values, setValues] = useState<ProjectUpsertDto>({
    projectName: initial?.projectName ?? '',
    description: initial?.description ?? '',
    startDate: initial?.startDate
      ? initial.startDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    endDate: initial?.endDate ? initial.endDate.slice(0, 10) : undefined,
    status: initial?.status ?? 0,
    departmentId: initialDeptId,
    isActive: initial?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  function set<K extends keyof ProjectUpsertDto>(k: K, v: ProjectUpsertDto[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!values.projectName.trim()) e.projectName = 'Project name is required';
    if (!values.startDate) e.startDate = 'Start date is required';
    if (!values.departmentId) e.departmentId = 'Department is required';
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
                const payload: ProjectUpsertDto = {
                  projectName: values.projectName.trim(),
                  description: values.description || null,
                  startDate: values.startDate,
                  endDate: values.endDate || null,
                  status: Number(values.status),
                  departmentId: Number(values.departmentId),
                  isActive: values.isActive ?? true,
                };
                const targetId = initial
                  ? (initial.projectId ?? initial.projectID!)
                  : undefined;
                if (targetId !== undefined) {
                  await Projects.update(targetId, payload);
                  toast.push('success', 'Project updated successfully.');
                } else {
                  await Projects.create(payload);
                  toast.push('success', 'Project created successfully.');
                }
                onSaved();
              } catch (e) {
                toast.push('error', getErrorMessage(e));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Project'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Project Name *</label>
          <input
            className={`input ${errors.projectName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
            placeholder="e.g. Website Redesign, Cloud Migration"
            value={values.projectName}
            onChange={(e) => set('projectName', e.target.value)}
          />
          {errors.projectName && (
            <p className="mt-1 text-xs font-semibold text-rose-500">{errors.projectName}</p>
          )}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="Brief description of the project scope..."
            value={values.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date *</label>
            <input
              type="date"
              className={`input ${errors.startDate ? 'border-rose-500 focus:border-rose-500' : ''}`}
              value={
                typeof values.startDate === 'string'
                  ? values.startDate.slice(0, 10)
                  : ''
              }
              onChange={(e) => set('startDate', e.target.value)}
            />
            {errors.startDate && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="label">End Date (Optional)</label>
            <input
              type="date"
              className="input"
              value={values.endDate ? String(values.endDate).slice(0, 10) : ''}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={values.status}
              onChange={(e) => set('status', Number(e.target.value))}
            >
              {ProjectStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Department *</label>
            <select
              className={`input ${errors.departmentId ? 'border-rose-500' : ''}`}
              value={values.departmentId}
              onChange={(e) => set('departmentId', Number(e.target.value))}
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => {
                const dId = d.departmentId ?? d.departmentID!;
                return (
                  <option key={dId} value={dId}>
                    {d.departmentName}
                  </option>
                );
              })}
            </select>
            {errors.departmentId && (
              <p className="mt-1 text-xs font-semibold text-rose-500">{errors.departmentId}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="projActive"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={values.isActive ?? true}
            onChange={(e) => set('isActive', e.target.checked)}
          />
          <label
            htmlFor="projActive"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Active Project (visible in general listings)
          </label>
        </div>
      </div>
    </Modal>
  );
}
