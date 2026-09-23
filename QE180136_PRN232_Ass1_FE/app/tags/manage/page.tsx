'use client';
import { useState } from 'react';
import { Tags } from '@/lib/services';
import { TagDto, TagUpsertDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';

export default function ManageTagsPage() {
  const list = useAsync(() => Tags.list(), []);
  const toast = useToast();
  const [editing, setEditing] = useState<TagDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const refresh = list.refresh;

  return (
    <>
      <PageHeader title="Manage Tags"
        actions={<button className="btn-primary" onClick={() => setCreating(true)}>+ New Tag</button>} />

      {list.loading && <Spinner />}
      {list.data?.length === 0 && <EmptyState title="No tags" />}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr><Th>Name</Th><Th>Color</Th><Th>Actions</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.data?.map(t => {
              const tId = t.tagId ?? t.tagID!;
              return (
                <tr key={tId}>
                  <Td className="font-medium text-slate-900">{t.tagName}</Td>
                  <Td>{t.color ? <span className="badge ring-slate-300 bg-slate-50 text-slate-700" style={{ backgroundColor: `${t.color}20`, color: t.color }}>{t.color}</span> : '—'}</Td>
                  <Td>
                    <button className="btn-secondary mr-2" onClick={() => setEditing(t)}>Edit</button>
                    <button className="btn-danger" onClick={() => setConfirmId(tId)}>Delete</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {creating && <TagFormModal title="Create Tag" onClose={() => setCreating(false)} onSaved={() => { setCreating(false); refresh(); }} />}
      {editing && <TagFormModal title={`Edit Tag #${editing.tagId ?? editing.tagID}`} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
      <ConfirmDialog
        open={confirmId !== null} title="Delete tag?" message="A tag can only be deleted if no task is currently using it."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try { await Tags.remove(confirmId); toast.push('success', 'Deleted.'); refresh(); }
          catch (e) { toast.push('error', getErrorMessage(e)); }
          finally { setConfirmId(null); }
        }}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{children}</th>; }
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <td className={`px-4 py-3 text-sm text-slate-800 ${className}`}>{children}</td>; }

function TagFormModal({ title, initial, onClose, onSaved }: { title: string; initial?: TagDto; onClose: () => void; onSaved: () => void }) {
  const [values, setValues] = useState<TagUpsertDto>({
    tagName: initial?.tagName ?? '',
    color: initial?.color ?? '#3B82F6',
  });
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  return (
    <Modal open={true} onClose={onClose} title={title} footer={
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={async () => {
          setError(null);
          if (!values.tagName.trim()) { setError('Name is required'); return; }
          try {
            const payload = { ...values, color: values.color || null } as TagUpsertDto;
            const targetId = initial ? (initial.tagId ?? initial.tagID!) : undefined;
            if (targetId !== undefined) await Tags.update(targetId, payload);
            else await Tags.create(payload);
            toast.push('success', 'Saved.');
            onSaved();
          } catch (e) { toast.push('error', getErrorMessage(e)); }
        }}>{initial ? 'Save changes' : 'Create'}</button>
      </>}>
      <div className="space-y-3">
        <div>
          <label className="label">Tag name *</label>
          <input className="input" value={values.tagName} onChange={e => setValues(p => ({ ...p, tagName: e.target.value }))} />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <div>
          <label className="label">Color (HEX code)</label>
          <input className="input" value={values.color ?? ''} onChange={e => setValues(p => ({ ...p, color: e.target.value }))} placeholder="#3B82F6" />
        </div>
      </div>
    </Modal>
  );
}

