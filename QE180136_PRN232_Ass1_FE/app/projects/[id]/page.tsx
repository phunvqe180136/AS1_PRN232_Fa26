'use client';
import Link from 'next/link';
import { useAsync } from '@/lib/useAsync';
import { Projects } from '@/lib/services';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge, TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import {
  ArrowLeft,
  FolderKanban,
  Building2,
  Calendar,
  CheckSquare2,
  PlusCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = useAsync(() => Projects.get(id), [id]);
  const tasks = q.data?.tasks ?? [];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to projects</span>
        </Link>
      </div>

      {q.loading && <Spinner label="Loading project details..." />}

      {q.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {q.error}
        </div>
      )}

      {q.data && (
        <>
          {/* Project Details Header Card */}
          <div className="card-glass relative overflow-hidden p-8">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900">
                  <FolderKanban className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {q.data.projectName}
                    </h1>
                    <StatusBadge value={q.data.status} />
                  </div>

                  {q.data.departmentName && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>Department:</span>
                      <Link
                        href={`/departments/${q.data.departmentId ?? q.data.departmentID}`}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        {q.data.departmentName}
                      </Link>
                    </div>
                  )}

                  {q.data.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl whitespace-pre-line">
                      {q.data.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Metadata Box */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 p-4 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span>Start: {new Date(q.data.startDate).toLocaleDateString()}</span>
                </div>
                {q.data.endDate && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>End: {new Date(q.data.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Linked Tasks:</span>
                  <span className="rounded-full bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 text-indigo-700 dark:text-indigo-300">
                    {tasks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckSquare2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Project Tasks
                </h2>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  {tasks.length}
                </span>
              </div>
              <Link
                href="/tasks/manage"
                className="btn-primary text-xs sm:text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Task</span>
              </Link>
            </div>

            {tasks.length === 0 && (
              <EmptyState
                title="No tasks linked to this project"
                hint="Create and assign tasks to organize your project workflow."
                icon={<CheckSquare2 className="h-8 w-8 text-indigo-400" />}
                action={
                  <Link href="/tasks/manage" className="btn-primary">
                    Create Task
                  </Link>
                }
              />
            )}

            <div className="grid grid-cols-1 gap-4">
              {tasks.map((t) => {
                const tId = t.taskId ?? t.taskID!;
                return (
                  <Link
                    key={tId}
                    href={`/tasks/${tId}`}
                    className="group card-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-all duration-200 hover:shadow-lg hover:border-indigo-500/30"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {t.title}
                        </h3>
                        <span className="text-xs text-slate-400">#{tId}</span>
                      </div>
                      {t.description && (
                        <p className="line-clamp-1 text-sm text-slate-600 dark:text-slate-400">
                          {t.description}
                        </p>
                      )}
                      {t.tags && t.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {t.tags.map((x) => (
                            <TagBadge
                              key={x.tagId ?? x.tagID}
                              name={x.tagName}
                              color={x.color}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <TaskStatusBadge value={t.status} />
                      <PriorityBadge value={t.priority} />
                      {t.dueDate && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Due {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
