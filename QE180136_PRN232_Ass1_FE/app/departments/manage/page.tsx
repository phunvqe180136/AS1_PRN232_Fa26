'use client';
import { useState } from 'react';
import { Departments } from '@/lib/services';
import { DepartmentDto, DepartmentUpsertDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';

export default function ManageDepartmentsPage() {
  const list = useAsync(() => Departments.list(), []);
  const toast = useToast();
  const [editing, setEditing] = useState<DepartmentDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const refresh = list.refresh;

  return (
    <>
      <PageHeader title="Manage Departments"
        actions={<button className="btn-primary" onClick={() => setCreating(true)}>+ New Department</button>} />

      {list.loading && <Spinner />}
      {list.data?.length === 0 && <EmptyState title="No departments" />}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <Th>Name</Th><Th>Description</Th><Th>Projects</Th><Th>Active</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.data?.map(d => {
              const dId = d.departmentId ?? d.departmentID!;
              return (
                <tr key={dId}>
                  <Td className="font-medium text-slate-900">{d.departmentName}</Td>
                  <Td className="max-w-md truncate">{d.departmentDescription}</Td>
                  <Td>{d.projectCount ?? 0}</Td>
                  <Td>
                    <span className={`badge ${d.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-100 text-slate-600 ring-slate-300'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td>
                    <button className="btn-secondary mr-2" onClick={() => setEditing(d)}>Edit</button>
                    <button className="btn-danger" onClick={() => setConfirmId(dId)}>Delete</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {creating && (
        <DepartmentFormModal title="Create Department" onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh(); }}>
          {(form) => <DepartmentFormFields form={form} />}
        </DepartmentFormModal>
      )}
      {editing && (
        <DepartmentFormModal title={`Edit Department #${editing.departmentId ?? editing.departmentID}`} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }}>
          {(form) => <DepartmentFormFields form={form} />}
        </DepartmentFormModal>
      )}
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete department?"
        message="This will permanently remove the department. Projects must be removed first."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try { await Departments.remove(confirmId); toast.push('success', 'Deleted.'); refresh(); }
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

function DepartmentFormFields({ form }: { form: ReturnType<typeof useDepartmentForm> }) {
  return (
    <>
      <div>
        <label className="label">Department name *</label>
        <input className="input" value={form.values.departmentName} onChange={e => form.set('departmentName', e.target.value)} />
        {form.errors.departmentName && <p className="mt-1 text-xs text-red-600">{form.errors.departmentName}</p>}
      </div>
      <div className="mt-3">
        <label className="label">Description *</label>
        <textarea className="input" rows={3} value={form.values.departmentDescription} onChange={e => form.set('departmentDescription', e.target.value)} />
        {form.errors.departmentDescription && <p className="mt-1 text-xs text-red-600">{form.errors.departmentDescription}</p>}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input type="checkbox" id="depActive" checked={form.values.isActive} onChange={e => form.set('isActive', e.target.checked)} />
        <label htmlFor="depActive" className="text-sm">Active</label>
      </div>
    </>
  );
}

function DepartmentFormModal({
  title, initial, onClose, onSaved, children,
}: { title: string; initial?: DepartmentDto; onClose: () => void; onSaved: () => void; children: (form: ReturnType<typeof useDepartmentForm>) => React.ReactNode }) {
  const form = useDepartmentForm(initial);
  const toast = useToast();
  return (
    <Modal open={true} onClose={onClose} title={title} footer={
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={async () => {
          if (!form.validate()) return;
          try {
            const targetId = initial ? (initial.departmentId ?? initial.departmentID!) : undefined;
            if (targetId !== undefined) await Departments.update(targetId, form.values);
            else await Departments.create(form.values);
            toast.push('success', 'Saved.');
            onSaved();
          } catch (e) { toast.push('error', getErrorMessage(e)); }
        }}>{initial ? 'Save changes' : 'Create'}</button>
      </>}>
      {children(form)}
    </Modal>
  );
}

function useDepartmentForm(initial?: DepartmentDto) {
  const [values, setValues] = useState<DepartmentUpsertDto>({
    departmentName: initial?.departmentName ?? '',
    departmentDescription: initial?.departmentDescription ?? '',
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof DepartmentUpsertDto>(k: K, v: DepartmentUpsertDto[K]) {
    setValues(prev => ({ ...prev, [k]: v }));
  }
  function validate() {
    const e: Record<string, string> = {};
    if (!values.departmentName.trim()) e.departmentName = 'Name is required';
    if (!values.departmentDescription.trim()) e.departmentDescription = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  return { values, set, errors, validate };
}

