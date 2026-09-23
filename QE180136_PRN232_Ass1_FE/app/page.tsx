'use client';
import Link from 'next/link';
import { Projects, Stats } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/Badges';

export default function HomePage() {
  const summary = useAsync(() => Stats.summary(), []);
  const projects = useAsync(() => Projects.list(), []);

  return (
    <>
      <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome to TaskTrack</h1>
        <p className="mt-2 max-w-2xl text-indigo-100">
          Browse departments, projects, and tasks across the organization. Use the
          management pages to add, edit, or remove records — no login required.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Departments"
          value={summary.data?.totalDepartments ?? summary.data?.departments}
          loading={summary.loading}
        />
        <StatCard
          label="Active Projects"
          value={summary.data?.totalProjects ?? summary.data?.projects}
          loading={summary.loading}
        />
        <StatCard
          label="Active Tasks"
          value={summary.data?.totalTasks ?? summary.data?.tasks}
          loading={summary.loading}
        />
      </div>

      <PageHeader title="Active Projects" subtitle="Click a project to view details and tasks." />

      {projects.loading && <Spinner />}
      {projects.error && <div className="text-red-600">{projects.error}</div>}
      {projects.data && projects.data.length === 0 && (
        <EmptyState title="No projects yet" hint="Add one via Projects → Manage Projects." />
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.data?.map(p => {
          const pId = p.projectId ?? p.projectID;
          return (
            <Link key={pId} href={`/projects/${pId}`} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-slate-900">{p.projectName}</h3>
                <StatusBadge value={p.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description || 'No description.'}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{p.departmentName ?? `Dept #${p.departmentId ?? p.departmentID}`}</span>
                {p.endDate && <span>Due {new Date(p.endDate).toLocaleDateString()}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function StatCard({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div className="card">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">
        {loading || value === undefined ? '—' : value}
      </div>
    </div>
  );
}

