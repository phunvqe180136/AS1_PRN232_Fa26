'use client';
import Link from 'next/link';
import { useAsync } from '@/lib/useAsync';
import { Projects } from '@/lib/services';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge, TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = useAsync(() => Projects.get(id), [id]);
  const tasks = q.data?.tasks ?? [];

  return (
    <>
      <Link href="/projects" className="text-sm font-medium text-indigo-600 hover:underline">← Back to projects</Link>
      {q.loading && <div className="mt-4"><Spinner /></div>}
      {q.error && <div className="mt-4 text-red-600">{q.error}</div>}
      {q.data && (
        <>
          <PageHeader
            title={q.data.projectName}
            subtitle={q.data.departmentName ?? undefined}
            actions={<StatusBadge value={q.data.status} />}
          />
          {q.data.description && (
            <div className="card mb-6">
              <p className="whitespace-pre-line text-sm text-slate-700">{q.data.description}</p>
              <div className="mt-3 text-xs text-slate-500">
                Start: {new Date(q.data.startDate).toLocaleDateString()}
                {q.data.endDate && ` · End: ${new Date(q.data.endDate).toLocaleDateString()}`}
              </div>
            </div>
          )}
          <h2 className="mb-3 text-lg font-semibold">Tasks ({tasks.length})</h2>
          {tasks.length === 0 && <EmptyState title="No tasks for this project" />}
          <ul className="space-y-2">
            {tasks.map(t => {
              const tId = t.taskId ?? t.taskID!;
              return (
                <li key={tId} className="card flex items-center justify-between">
                  <div>
                    <Link href={`/tasks/${tId}`} className="font-medium text-indigo-700 hover:underline">
                      {t.title}
                    </Link>
                    {t.description && <p className="mt-1 text-xs text-slate-500 line-clamp-1">{t.description}</p>}
                    {t.tags && t.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {t.tags.map(x => (
                          <TagBadge key={x.tagId ?? x.tagID} name={x.tagName} color={x.color} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <TaskStatusBadge value={t.status} />
                    <PriorityBadge value={t.priority} />
                    {t.dueDate && <span className="text-xs text-slate-500">Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

