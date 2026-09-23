'use client';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Projects, Tags, Tasks } from '@/lib/services';
import { ProjectDto, TagDto, TaskDto } from '@/lib/types';
import { Spinner, EmptyState, SkeletonCards } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import { TaskStatusOptions, TaskPriorityOptions } from '@/lib/enums';
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  FolderKanban,
  ArrowRight,
} from 'lucide-react';

export default function SearchPage() {
  return (
    <Suspense fallback={<Spinner label="Loading search..." />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [title, setTitle] = useState(initialQuery);
  const [status, setStatus] = useState<number | ''>('');
  const [priority, setPriority] = useState<number | ''>('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [tagId, setTagId] = useState<number | ''>('');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [results, setResults] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Projects.list().then(setProjects).catch(() => {});
    Tags.list().then(setTags).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    Tasks.search({
      title: title || undefined,
      status: status === '' ? undefined : Number(status),
      priority: priority === '' ? undefined : Number(priority),
      projectId: projectId === '' ? undefined : Number(projectId),
      tagId: tagId === '' ? undefined : Number(tagId),
    })
      .then(setResults)
      .finally(() => setLoading(false));
  }, [title, status, priority, projectId, tagId]);

  const resetFilters = () => {
    setTitle('');
    setStatus('');
    setPriority('');
    setProjectId('');
    setTagId('');
  };

  const hasActiveFilters = Boolean(
    title || status !== '' || priority !== '' || projectId !== '' || tagId !== ''
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Global Search &amp; Filter"
        subtitle="Search tasks by title keyword, project scope, status, priority, or tag."
        badge="Omni Search"
        action={
          hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn-secondary text-xs sm:text-sm"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              <span>Reset All Filters</span>
            </button>
          )
        }
      />

      {/* Filter Control Box */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <span>Search Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="label">Title Keyword</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="input pl-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. login, design, database..."
              />
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <option value="">Any Status</option>
              {TaskStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Priority</label>
            <select
              className="input"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <option value="">Any Priority</option>
              {TaskPriorityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Project</label>
            <select
              className="input"
              value={projectId}
              onChange={(e) =>
                setProjectId(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <option value="">Any Project</option>
              {projects.map((p) => {
                const pId = p.projectId ?? p.projectID!;
                return (
                  <option key={pId} value={pId}>
                    {p.projectName}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Tag</label>
            <select
              className="input"
              value={tagId}
              onChange={(e) =>
                setTagId(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <option value="">Any Tag</option>
              {tags.map((t) => {
                const tId = t.tagId ?? t.tagID!;
                return (
                  <option key={tId} value={tId}>
                    {t.tagName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="text-sm font-bold text-slate-900">
          Search Results ({results.length})
        </div>
      </div>

      {loading && <SkeletonCards count={3} />}

      {results.length === 0 && !loading && (
        <EmptyState
          title="No tasks match your search criteria"
          hint="Try adjusting keywords or selecting different status/priority filters."
          icon={<Search className="h-8 w-8 text-indigo-400" />}
          action={
            hasActiveFilters ? (
              <button onClick={resetFilters} className="btn-secondary">
                Reset Filters
              </button>
            ) : undefined
          }
        />
      )}

      <div className="grid grid-cols-1 gap-3.5">
        {results.map((t) => {
          const tId = t.taskId ?? t.taskID!;
          return (
            <Link
              key={tId}
              href={`/tasks/${tId}`}
              className="group rounded-3xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {t.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">#{tId}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="inline-flex items-center gap-1 text-slate-600">
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

              <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <TaskStatusBadge value={t.status} />
                <PriorityBadge value={t.priority} />
                {t.dueDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Due {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
                <div className="hidden md:flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
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
