'use client';
import Link from 'next/link';
import { useAsync } from '@/lib/useAsync';
import { Tasks } from '@/lib/services';
import { Spinner } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import {
  ArrowLeft,
  CheckSquare2,
  FolderKanban,
  Calendar,
  Clock,
  Tag as TagIcon,
  Edit2,
} from 'lucide-react';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = useAsync(() => Tasks.get(id), [id]);
  const tags = q.data?.tags ?? [];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to tasks</span>
        </Link>
      </div>

      {q.loading && <Spinner label="Loading task details..." />}

      {q.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {q.error}
        </div>
      )}

      {q.data && (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="card-glass relative overflow-hidden p-8">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                  <CheckSquare2 className="h-7 w-7" />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {q.data.title}
                    </h1>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                      Task #{id}
                    </span>
                  </div>

                  {q.data.projectName && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <FolderKanban className="h-4 w-4 text-slate-400" />
                      <span>Project:</span>
                      <Link
                        href={`/projects/${q.data.projectId ?? q.data.projectID}`}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        {q.data.projectName}
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <TaskStatusBadge value={q.data.status} />
                    <PriorityBadge value={q.data.priority} />
                  </div>
                </div>
              </div>

              <Link
                href="/tasks/manage"
                className="btn-secondary self-start lg:self-center shrink-0 text-xs sm:text-sm"
              >
                <Edit2 className="h-4 w-4 text-indigo-600" />
                <span>Manage in Hub</span>
              </Link>
            </div>

            {/* Description */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Description &amp; Notes
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {q.data.description || 'No detailed description provided for this task.'}
              </p>
            </div>

            {/* Tags Section */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5" />
                <span>Assigned Tags</span>
              </h3>
              {tags.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tags assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <TagBadge
                      key={t.tagId ?? t.tagID}
                      name={t.tagName}
                      color={t.color}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Timestamps Grid */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/80 p-3.5 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block">Due Date</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  {q.data.dueDate ? new Date(q.data.dueDate).toLocaleDateString() : 'No deadline'}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/80 p-3.5 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block">Created On</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  {new Date(q.data.createdDate).toLocaleDateString()}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50/80 dark:bg-slate-900/80 p-3.5 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block">Last Modified</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {q.data.modifiedDate ? new Date(q.data.modifiedDate).toLocaleDateString() : 'Original'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
