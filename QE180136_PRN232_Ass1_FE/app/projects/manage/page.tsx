'use client';
import { useState } from 'react';
import { Projects, Departments } from '@/lib/services';
import { ProjectDto, ProjectUpsertDto, DepartmentDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';
import { StatusBadge } from '@/components/Badges';
import { ProjectStatusOptions } from '@/lib/enums';

export default function ManageProjectsPage() {
  const list = useAsync(() => Projects.list(), []);
  const departments = useAsync(() => Departments.list(), []);
  const toast = useToast();
  const [editing, setEditing] = useState<ProjectDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const refresh = list.refresh;

  return (
    <>
      <PageHeader title="Manage Projects"
        actions={<button className="btn-primary" onClick={() => setCreating(true)}>+ New Project</button>} />

      {list.loading && <Spinner />}
      {list.data?.length === 0 && <EmptyState title="No projects" />}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <Th>Name</Th><Th>Department</Th><Th>Status</Th><Th>Start</Th><Th>End</Th><Th>Active</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.data?.map(p => {
              const pId = p.projectId ?? p.projectID!;
              return (
                <tr key={pId}>
                  <Td className="font-medium text-slate-900">{p.projectName}</Td>
                  <Td>{p.departmentName ?? `Dept #${p.departmentId ?? p.departmentID}`}</Td>
                  <Td><StatusBadge value={p.status} /></Td>
                  <Td>{new Date(p.startDate).toLocaleDateString()}</Td>
                  <Td>{p.endDate ? new Date(p.endDate).toLocaleDateString() : '—'}</Td>
                  <Td>
                    <span className={`badge ${p.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-100 text-slate-600 ring-slate-300'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td>
                    <button className="btn-secondary mr-2" onClick={() => setEditing(p)}>Edit</button>
                    <button className="btn-danger" onClick={() => setConfirmId(pId)}>Delete</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {creating && (
        <ProjectFormModal title="Create Project" departments={departments.data ?? []} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh(); }} />
      )}
      {editing && (
        <ProjectFormModal title={`Edit Project #${editing.projectId ?? editing.projectID}`} initial={editing} departments={departments.data ?? []} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
      )}
      <ConfirmDialog
        open={confirmId !== null} title="Delete project?" message="Project must have no linked tasks."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try { await Projects.remove(confirmId); toast.push('success', 'Deleted.'); refresh(); }
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

function ProjectFormModal({
  title, initial, departments, onClose, onSaved,
}: { title: string; initial?: ProjectDto; departments: DepartmentDto[]; onClose: () => void; onSaved: () => void }) {
  const initialDeptId = initial?.departmentId ?? initial?.departmentID ?? departments[0]?.departmentId ?? departments[0]?.departmentID ?? 0;
  const [values, setValues] = useState<ProjectUpsertDto>({
    projectName: initial?.projectName ?? '',
    description: initial?.description ?? '',
    startDate: initial?.startDate ? initial.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    endDate: initial?.endDate ? initial.endDate.slice(0, 10) : undefined,
    status: initial?.status ?? 0,
    departmentId: initialDeptId,
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  function set<K extends keyof ProjectUpsertDto>(k: K, v: ProjectUpsertDto[K]) {
    setValues(prev => ({ ...prev, [k]: v }));
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!values.projectName.trim()) e.projectName = 'Name is required';
    if (!values.startDate) e.startDate = 'Start date is required';
    if (!values.departmentId) e.departmentId = 'Department is required';
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
            const payload: ProjectUpsertDto = {
              projectName: values.projectName.trim(),
              description: values.description || null,
              startDate: values.startDate,
              endDate: values.endDate || null,
              status: Number(values.status),
              departmentId: Number(values.departmentId),
              isActive: values.isActive ?? true,
            };
            const targetId = initial ? (initial.projectId ?? initial.projectID!) : undefined;
            if (targetId !== undefined) await Projects.update(targetId, payload);
            else await Projects.create(payload);
            toast.push('success', 'Saved.');
            onSaved();
          } catch (e) { toast.push('error', getErrorMessage(e)); }
        }}>{initial ? 'Save changes' : 'Create'}</button>
      </>}>
      <div className="space-y-3">
        <div>
          <label className="label">Project name *</label>
          <input className="input" value={values.projectName} onChange={e => set('projectName', e.target.value)} />
          {errors.projectName && <p className="mt-1 text-xs text-red-600">{errors.projectName}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={values.description ?? ''} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start *</label>
            <input type="date" className="input" value={typeof values.startDate === 'string' ? values.startDate.slice(0, 10) : ''} onChange={e => set('startDate', e.target.value)} />
            {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
          </div>
          <div>
            <label className="label">End</label>
            <input type="date" className="input" value={values.endDate ? String(values.endDate).slice(0, 10) : ''} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={values.status} onChange={e => set('status', Number(e.target.value))}>
            {ProjectStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Department *</label>
          <select className="input" value={values.departmentId} onChange={e => set('departmentId', Number(e.target.value))}>
            <option value="">-- select --</option>
            {departments.map(d => {
              const dId = d.departmentId ?? d.departmentID!;
              return <option key={dId} value={dId}>{d.departmentName}</option>;
            })}
          </select>
          {errors.departmentId && <p className="mt-1 text-xs text-red-600">{errors.departmentId}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="projActive" checked={values.isActive ?? true} onChange={e => set('isActive', e.target.checked)} />
          <label htmlFor="projActive" className="text-sm">Active</label>
        </div>
      </div>
    </Modal>
  );
}

