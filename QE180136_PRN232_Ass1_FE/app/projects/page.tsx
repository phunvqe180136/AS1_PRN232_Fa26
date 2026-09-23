'use client';
import Link from 'next/link';
import { Projects } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/Badges';

export default function ProjectsPage() {
  const list = useAsync(() => Projects.list(), []);
  return (
    <>
      <PageHeader title="All Projects" subtitle="Browse every active project." />
      {list.loading && <Spinner />}
      {list.data?.length === 0 && <EmptyState title="No projects" />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.data?.map(p => {
          const pId = p.projectId ?? p.projectID!;
          return (
            <Link key={pId} href={`/projects/${pId}`} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{p.projectName}</h3>
                <StatusBadge value={p.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{p.departmentName ?? `Dept #${p.departmentId ?? p.departmentID}`}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description || 'No description.'}</p>
              <div className="mt-3 text-xs text-slate-400">
                Start: {new Date(p.startDate).toLocaleDateString()}
                {p.endDate && ` · End: ${new Date(p.endDate).toLocaleDateString()}`}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

