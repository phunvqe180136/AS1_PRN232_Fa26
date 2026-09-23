'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Tasks } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState, SkeletonCards } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import { TaskStatusOptions } from '@/lib/enums';
import {
  CheckSquare2,
  PlusCircle,
  Search,
  Calendar,
  FolderKanban,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function TasksPage() {
  const [selectedStatus, setSelectedStatus] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const list = useAsync(
    () =>
      selectedStatus === 'all'
        ? Tasks.list()
        : Tasks.search({ status: selectedStatus }),
    [selectedStatus]
  );

  const filteredTasks = useMemo(() => {
    if (!list.data) return [];
    if (!searchTerm.trim()) return list.data;
    return list.data.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [list.data, searchTerm]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tasks Overview"
        subtitle="Track, filter, and organize work items across all active company projects."
        badge="Workflow"
        action={
          <Link href="/tasks/manage" className="btn-primary text-xs sm:text-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Manage Tasks</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="input pl-10 text-xs sm:text-sm"
            placeholder="Search tasks or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs (Bonus requirement) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All Tasks
          </button>
          {TaskStatusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedStatus(opt.value)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStatus === opt.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {list.loading && <SkeletonCards count={4} />}

      {list.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && filteredTasks.length === 0 && !list.loading && (
        <EmptyState
          title="No tasks match your criteria"
          hint="Try adjusting the status tab or search query, or create a new task."
          icon={<CheckSquare2 className="h-8 w-8 text-indigo-400" />}
          action={
            <Link href="/tasks/manage" className="btn-primary">
              Create Task
            </Link>
          }
        />
      )}

      <div className="grid grid-cols-1 gap-3.5">
        {filteredTasks.map((t) => {
          const tId = t.taskId ?? t.taskID!;
          return (
            <Link
              key={tId}
              href={`/tasks/${tId}`}
              className="group card-glass flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 transition-all duration-200 hover:shadow-lg hover:border-indigo-500/30 hover:-translate-y-0.5"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {t.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">#{tId}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                    {t.projectName ?? `Project #${t.projectId ?? t.projectID}`}
                  </span>
                </div>

                {t.tags && t.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
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

              <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <TaskStatusBadge value={t.status} />
                <PriorityBadge value={t.priority} />
                {t.dueDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Due {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
                <div className="hidden md:flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:text-indigo-600 transition-colors">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
