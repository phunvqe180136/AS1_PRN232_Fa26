'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Tasks } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import { TaskStatusOptions } from '@/lib/enums';

export default function TasksPage() {
  const [selectedStatus, setSelectedStatus] = useState<number | 'all'>('all');
  const list = useAsync(
    () => selectedStatus === 'all'
      ? Tasks.list()
      : Tasks.search({ status: selectedStatus }),
    [selectedStatus]
  );

  return (
    <>
      <PageHeader
        title="All Tasks"
        subtitle="Browse and filter active tasks across all projects."
        actions={
          <Link href="/tasks/manage" className="btn-primary">
            + New Task
          </Link>
        }
      />

      {/* Bonus Feature: Status Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            selectedStatus === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          All Tasks
        </button>
        {TaskStatusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSelectedStatus(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStatus === opt.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {list.loading && <Spinner />}
      {list.error && <div className="text-red-600">{list.error}</div>}
      {list.data?.length === 0 && !list.loading && (
        <EmptyState title="No tasks found" hint="Try changing the status filter or create a new task." />
      )}

      <ul className="space-y-2">
        {list.data?.map(t => {
          const tId = t.taskId ?? t.taskID!;
          return (
            <li key={tId} className="card flex items-center justify-between hover:shadow-md transition">
              <div>
                <Link href={`/tasks/${tId}`} className="font-medium text-indigo-700 hover:underline">
                  {t.title}
                </Link>
                <p className="text-xs text-slate-500">{t.projectName ?? `Project #${t.projectId ?? t.projectID}`}</p>
                {t.tags && t.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.tags.map(x => (
                      <TagBadge key={x.tagId ?? x.tagID} name={x.tagName} color={x.color} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <TaskStatusBadge value={t.status} />
                <PriorityBadge value={t.priority} />
                {t.dueDate && (
                  <span className="text-xs text-slate-500">
                    Due {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

