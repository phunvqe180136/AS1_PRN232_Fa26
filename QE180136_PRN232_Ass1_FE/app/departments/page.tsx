'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Departments } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { SkeletonCards, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { Building2, Search, ArrowRight, FolderKanban, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function DepartmentsPage() {
  const [name, setName] = useState('');
  const list = useAsync(
    () => (name.trim() ? Departments.search(name) : Departments.list()),
    [name]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Departments"
        subtitle="Browse organizational divisions and their assigned active projects."
        badge="Organization"
        action={
          <Link href="/departments/manage" className="btn-primary text-xs sm:text-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Manage Departments</span>
          </Link>
        }
      />

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          className="input pl-10"
          placeholder="Search departments by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {name && (
          <button
            onClick={() => setName('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {list.loading && <SkeletonCards count={3} />}

      {list.error && (
        <div className="card-glass border-rose-500/30 p-6 text-center text-rose-600">
          {list.error}
        </div>
      )}

      {list.data && list.data.length === 0 && (
        <EmptyState
          title="No departments found"
          hint={name ? `No results match "${name}".` : 'Get started by creating a department.'}
          icon={<Building2 className="h-8 w-8 text-indigo-500" />}
          action={
            <Link href="/departments/manage" className="btn-primary">
              Create Department
            </Link>
          }
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.data?.map((d) => {
          const dId = d.departmentId ?? d.departmentID;
          return (
            <Link
              key={dId}
              href={`/departments/${dId}`}
              className="group card-glass flex flex-col justify-between p-6 transition-all duration-300 hover:shadow-xl hover:border-indigo-500/30 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {d.departmentName}
                      </h3>
                      <span className="text-xs text-slate-400">ID #{dId}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <FolderKanban className="h-3 w-3 text-slate-400" />
                    {d.projectCount ?? 0}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {d.departmentDescription || 'No description available for this department.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
                <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                  View Projects <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
