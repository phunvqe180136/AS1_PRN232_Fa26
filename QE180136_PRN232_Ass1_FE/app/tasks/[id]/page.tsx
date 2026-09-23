'use client';
import Link from 'next/link';
import { useAsync } from '@/lib/useAsync';
import { Tasks } from '@/lib/services';
import { Spinner } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = useAsync(() => Tasks.get(id), [id]);
  const tags = q.data?.tags ?? [];

  return (
    <>
      <Link href="/tasks" className="text-sm font-medium text-indigo-600 hover:underline">← Back to tasks</Link>
      {q.loading && <div className="mt-4"><Spinner /></div>}
      {q.error && <div className="mt-4 text-red-600">{q.error}</div>}
      {q.data && (
        <>
          <PageHeader
            title={q.data.title}
            subtitle={q.data.projectName ?? undefined}
            actions={
              <div className="flex gap-2">
                <TaskStatusBadge value={q.data.status} />
                <PriorityBadge value={q.data.priority} />
              </div>
            }
          />
          <div className="card">
            {q.data.description && (
              <p className="whitespace-pre-line text-sm text-slate-700">{q.data.description}</p>
            )}
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <div><span className="font-medium">Due:</span> {q.data.dueDate ? new Date(q.data.dueDate).toLocaleDateString() : '—'}</div>
              <div><span className="font-medium">Created:</span> {new Date(q.data.createdDate).toLocaleDateString()}</div>
              {q.data.modifiedDate && <div><span className="font-medium">Modified:</span> {new Date(q.data.modifiedDate).toLocaleDateString()}</div>}
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-slate-700">Tags:</span>{' '}
              {tags.length === 0 ? (
                <span className="text-sm text-slate-500">none</span>
              ) : (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <TagBadge key={t.tagId ?? t.tagID} name={t.tagName} color={t.color} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

