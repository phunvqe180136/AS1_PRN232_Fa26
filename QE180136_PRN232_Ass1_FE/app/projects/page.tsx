'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Projects } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { SkeletonCards, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/Badges';
import {
  FolderKanban,
  Search,
  Building2,
  Calendar,
  ArrowRight,
  PlusCircle,
  Filter,
} from 'lucide-react';
import { ProjectStatusOptions } from '@/lib/enums';

export default function ProjectsPage() {
  const list = useAsync(() => Projects.list(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | 'ALL'>('ALL');

  const filteredProjects = useMemo(() => {
    if (!list.data) return [];
    return list.data.filter((p) => {
      const matchSearch =
        p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.departmentName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        selectedStatus === 'ALL' || Number(p.status) === Number(selectedStatus);
      return matchSearch && matchStatus;
    });
  }, [list.data, searchTerm, selectedStatus]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        subtitle="Manage and explore ongoing company initiatives across departments."
        badge="Initiatives"
        action={
          <Link href="/projects/manage" className="btn-primary text-xs sm:text-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Manage Projects</span>
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
            placeholder="Search projects or department..."
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

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedStatus === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All ({list.data?.length ?? 0})
          </button>
          {ProjectStatusOptions.map((opt) => {
            const count =
              list.data?.filter((p) => Number(p.status) === opt.value).length ?? 0;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedStatus === opt.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {list.loading && <SkeletonCards count={6} />}

      {list.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && filteredProjects.length === 0 && (
        <EmptyState
          title="No projects found"
          hint={
            searchTerm || selectedStatus !== 'ALL'
              ? 'No projects match your current filters.'
              : 'Create your first project to begin tracking tasks.'
          }
          icon={<FolderKanban className="h-8 w-8 text-indigo-400" />}
          action={
            <Link href="/projects/manage" className="btn-primary">
              Create Project
            </Link>
          }
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((p) => {
          const pId = p.projectId ?? p.projectID!;
          return (
            <Link
              key={pId}
              href={`/projects/${pId}`}
              className="group card-glass flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-xl hover:border-indigo-500/30 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {p.projectName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {p.departmentName ?? `Dept #${p.departmentId ?? p.departmentID}`}
                      </span>
                    </div>
                  </div>

                  <StatusBadge value={p.status} />
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {p.description || 'No description provided for this project.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(p.startDate).toLocaleDateString()}</span>
                  {p.endDate && <span>→ {new Date(p.endDate).toLocaleDateString()}</span>}
                </div>

                <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                  View <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
