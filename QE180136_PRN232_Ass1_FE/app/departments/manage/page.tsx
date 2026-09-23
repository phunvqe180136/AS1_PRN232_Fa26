'use client';
import { useState } from 'react';
import { Departments } from '@/lib/services';
import { DepartmentDto, DepartmentUpsertDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { SkeletonTable, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';
import {
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  FolderKanban,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';

export default function ManageDepartmentsPage() {
  const list = useAsync(() => Departments.list(), []);
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<DepartmentDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const refresh = list.refresh;

  const filtered = list.data?.filter((d) =>
    d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.departmentDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Department Management"
        subtitle="Create, update, and manage organizational units and business departments."
        badge="Admin Hub"
        action={
          <button
            className="btn-primary text-xs sm:text-sm"
            onClick={() => setCreating(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Department</span>
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="input pl-10 text-xs sm:text-sm"
            placeholder="Filter departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered?.length ?? 0} of {list.data?.length ?? 0} departments
        </div>
      </div>

      {list.loading && <SkeletonTable rows={4} cols={5} />}

      {list.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <EmptyState
          title="No departments available"
          hint="Create a new department to start organizing projects and tasks."
          icon={<Building2 className="h-8 w-8 text-indigo-400" />}
          action={
            <button className="btn-primary" onClick={() => setCreating(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Department
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
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-center">Projects</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                {filtered.map((d) => {
                  const dId = d.departmentId ?? d.departmentID!;
                  return (
                    <tr
                      key={dId}
                      className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div>{d.departmentName}</div>
                            <div className="text-xs font-normal text-slate-400">ID #{dId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                        {d.departmentDescription || <span className="text-slate-400 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <FolderKanban className="h-3 w-3 text-slate-400" />
                          {d.projectCount ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            d.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {d.isActive ? (
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
                            onClick={() => setEditing(d)}
                          >
                            <Edit2 className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn-danger py-1.5 px-3 text-xs"
                            onClick={() => setConfirmId(dId)}
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
        <DepartmentFormModal
          title="Create Department"
          subtitle="Add a new organizational unit to the company directory."
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            refresh();
          }}
        >
          {(form) => <DepartmentFormFields form={form} />}
        </DepartmentFormModal>
      )}

      {editing && (
        <DepartmentFormModal
          title={`Edit Department #${editing.departmentId ?? editing.departmentID}`}
          subtitle={`Update details for ${editing.departmentName}`}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        >
          {(form) => <DepartmentFormFields form={form} />}
        </DepartmentFormModal>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Department?"
        message="This will permanently delete this department. Any associated projects must be reassigned or deleted first."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try {
            await Departments.remove(confirmId);
            toast.push('success', 'Department deleted successfully.');
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

function DepartmentFormFields({ form }: { form: ReturnType<typeof useDepartmentForm> }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Department Name *</label>
        <input
          className={`input ${form.errors.departmentName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
          placeholder="e.g. Engineering, Marketing, Finance"
          value={form.values.departmentName}
          onChange={(e) => form.set('departmentName', e.target.value)}
        />
        {form.errors.departmentName && (
          <p className="mt-1 text-xs font-semibold text-rose-500">{form.errors.departmentName}</p>
        )}
      </div>

      <div>
        <label className="label">Description *</label>
        <textarea
          className={`input resize-none ${form.errors.departmentDescription ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
          rows={3}
          placeholder="Describe the department's responsibilities..."
          value={form.values.departmentDescription}
          onChange={(e) => form.set('departmentDescription', e.target.value)}
        />
        {form.errors.departmentDescription && (
          <p className="mt-1 text-xs font-semibold text-rose-500">{form.errors.departmentDescription}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="depActive"
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          checked={form.values.isActive}
          onChange={(e) => form.set('isActive', e.target.checked)}
        />
        <label htmlFor="depActive" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          Active Department (visible across platform)
        </label>
      </div>
    </div>
  );
}

function DepartmentFormModal({
  title,
  subtitle,
  initial,
  onClose,
  onSaved,
  children,
}: {
  title: string;
  subtitle?: string;
  initial?: DepartmentDto;
  onClose: () => void;
  onSaved: () => void;
  children: (form: ReturnType<typeof useDepartmentForm>) => React.ReactNode;
}) {
  const form = useDepartmentForm(initial);
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

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
              if (!form.validate()) return;
              try {
                setSubmitting(true);
                const targetId = initial ? (initial.departmentId ?? initial.departmentID!) : undefined;
                if (targetId !== undefined) {
                  await Departments.update(targetId, form.values);
                  toast.push('success', 'Department updated successfully.');
                } else {
                  await Departments.create(form.values);
                  toast.push('success', 'Department created successfully.');
                }
                onSaved();
              } catch (e) {
                toast.push('error', getErrorMessage(e));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Department'}
          </button>
        </>
      }
    >
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
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!values.departmentName.trim()) e.departmentName = 'Department name is required';
    if (!values.departmentDescription.trim()) e.departmentDescription = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return { values, set, errors, validate };
}
