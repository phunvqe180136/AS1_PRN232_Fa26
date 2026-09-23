'use client';
import Link from 'next/link';
import { useAsync } from '@/lib/useAsync';
import { Departments } from '@/lib/services';
import { SkeletonCards, EmptyState, Spinner } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/Badges';
import {
  ArrowLeft,
  Building2,
  FolderKanban,
  Calendar,
  ArrowRight,
  PlusCircle,
  Clock,
} from 'lucide-react';

export default function DepartmentDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = useAsync(() => Departments.get(id), [id]);

  const projects = q.data?.projects ?? [];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to departments</span>
        </Link>
      </div>

      {q.loading && <Spinner label="Loading department details..." />}

      {q.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {q.error}
        </div>
      )}

      {q.data && (
        <>
          {/* Department Header Card */}
          <div className="card-glass relative overflow-hidden p-8">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {q.data.departmentName}
                    </h1>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      ID #{id}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {q.data.departmentDescription || 'No description provided.'}
                  </p>
                </div>
              </div>

              <Link
                href="/projects/manage"
                className="btn-primary shrink-0 self-start sm:self-center text-xs sm:text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Project</span>
              </Link>
            </div>
          </div>

          {/* Assigned Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Assigned Projects
                </h2>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  {projects.length}
                </span>
              </div>
            </div>

            {projects.length === 0 && (
              <EmptyState
                title="No projects assigned to this department"
                hint="Create a new project and assign it to this department."
                icon={<FolderKanban className="h-8 w-8 text-indigo-400" />}
                action={
                  <Link href="/projects/manage" className="btn-primary">
                    Create Project
                  </Link>
                }
              />
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => {
                const pId = p.projectId ?? p.projectID;
                return (
                  <Link
                    key={pId}
                    href={`/projects/${pId}`}
                    className="group card-glass flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-xl hover:border-indigo-500/30 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {p.projectName}
                        </h3>
                        <StatusBadge value={p.status} />
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {p.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(p.startDate).toLocaleDateString()}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Details <ArrowRight className="h-3 w-3" />
                      </span>
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
