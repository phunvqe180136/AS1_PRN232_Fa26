'use client';
import { useState } from 'react';
import { Tags } from '@/lib/services';
import { TagDto, TagUpsertDto } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { SkeletonTable, EmptyState } from '@/components/States';
import { Modal, ConfirmDialog } from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { PageHeader } from '@/components/PageHeader';
import { getErrorMessage } from '@/lib/api';
import { TagBadge } from '@/components/Badges';
import {
  Tag,
  PlusCircle,
  Edit2,
  Trash2,
  Palette,
  Search,
} from 'lucide-react';

export default function ManageTagsPage() {
  const list = useAsync(() => Tags.list(), []);
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<TagDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const refresh = list.refresh;

  const filtered = list.data?.filter((t) =>
    t.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tag Management"
        subtitle="Organize work items with custom labels, colored badges, and categories."
        badge="Taxonomy"
        action={
          <button
            className="btn-primary text-xs sm:text-sm"
            onClick={() => setCreating(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Tag</span>
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
            placeholder="Filter tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered?.length ?? 0} of {list.data?.length ?? 0} tags
        </div>
      </div>

      {list.loading && <SkeletonTable rows={4} cols={3} />}

      {list.error && (
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <EmptyState
          title="No tags available"
          hint="Create tags to categorize and filter your project tasks."
          icon={<Tag className="h-8 w-8 text-indigo-400" />}
          action={
            <button className="btn-primary" onClick={() => setCreating(true)}>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Tag
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
                  <th className="px-6 py-4 text-left">Tag Label</th>
                  <th className="px-6 py-4 text-left">Color Badge Preview</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((t) => {
                  const tId = t.tagId ?? t.tagID!;
                  return (
                    <tr key={tId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Tag className="h-4 w-4" />
                          </div>
                          <div>
                            <div>{t.tagName}</div>
                            <div className="text-xs font-normal text-slate-400">ID #{tId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TagBadge name={t.tagName} color={t.color} />
                        {t.color && (
                          <span className="ml-2 font-mono text-xs text-slate-400">
                            {t.color}
                          </span>
                        )}
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
        <TagFormModal
          title="Create Tag"
          subtitle="Add a new color-coded label for categorizing tasks."
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}

      {editing && (
        <TagFormModal
          title={`Edit Tag #${editing.tagId ?? editing.tagID}`}
          subtitle={`Update properties for tag "${editing.tagName}"`}
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
        title="Delete Tag?"
        message="A tag can only be deleted if it is not currently assigned to any active tasks."
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          if (confirmId == null) return;
          try {
            await Tags.remove(confirmId);
            toast.push('success', 'Tag deleted successfully.');
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

function TagFormModal({
  title,
  subtitle,
  initial,
  onClose,
  onSaved,
}: {
  title: string;
  subtitle?: string;
  initial?: TagDto;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<TagUpsertDto>({
    tagName: initial?.tagName ?? '',
    color: initial?.color ?? '#4F46E5',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const presetColors = [
    '#4F46E5', // Indigo
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Rose
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#64748B', // Slate
  ];

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
              setError(null);
              if (!values.tagName.trim()) {
                setError('Tag name is required');
                return;
              }
              try {
                setSubmitting(true);
                const payload = {
                  tagName: values.tagName.trim(),
                  color: values.color || null,
                } as TagUpsertDto;
                const targetId = initial
                  ? (initial.tagId ?? initial.tagID!)
                  : undefined;
                if (targetId !== undefined) {
                  await Tags.update(targetId, payload);
                  toast.push('success', 'Tag updated successfully.');
                } else {
                  await Tags.create(payload);
                  toast.push('success', 'Tag created successfully.');
                }
                onSaved();
              } catch (e) {
                toast.push('error', getErrorMessage(e));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Tag'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Tag Name *</label>
          <input
            className={`input ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
            placeholder="e.g. Bug, Feature, Documentation, API"
            value={values.tagName}
            onChange={(e) => setValues((p) => ({ ...p, tagName: e.target.value }))}
          />
          {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
        </div>

        <div>
          <label className="label">Accent Color (HEX)</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="h-10 w-12 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white"
              value={values.color ?? '#4F46E5'}
              onChange={(e) => setValues((p) => ({ ...p, color: e.target.value }))}
            />
            <input
              className="input font-mono uppercase"
              value={values.color ?? ''}
              onChange={(e) => setValues((p) => ({ ...p, color: e.target.value }))}
              placeholder="#4F46E5"
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Presets:</span>
            {presetColors.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setValues((p) => ({ ...p, color: c }))}
                className="h-6 w-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="label">Badge Preview</label>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center">
            <TagBadge name={values.tagName || 'Tag Preview'} color={values.color} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
