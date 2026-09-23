'use client';
import Link from 'next/link';
import { useAsync } from '@/lib/useAsync';
import { Departments } from '@/lib/services';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/Badges';

export default function DepartmentDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = useAsync(() => Departments.get(id), [id]);

  const projects = q.data?.projects ?? [];

  return (
    <>
      <Link href="/departments" className="text-sm font-medium text-indigo-600 hover:underline">← Back to departments</Link>
      {q.loading && <div className="mt-4"><Spinner /></div>}
      {q.error && <div className="mt-4 text-red-600">{q.error}</div>}
      {q.data && (
        <>
          <PageHeader title={q.data.departmentName} subtitle={q.data.departmentDescription} />
          <h2 className="mb-3 text-lg font-semibold">Projects ({projects.length})</h2>
          {projects.length === 0 && <EmptyState title="No projects in this department" />}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => {
              const pId = p.projectId ?? p.projectID;
              return (
                <Link key={pId} href={`/projects/${pId}`} className="card hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{p.projectName}</h3>
                    <StatusBadge value={p.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description || 'No description.'}</p>
                  <div className="mt-3 text-xs text-slate-500">
                    Start: {new Date(p.startDate).toLocaleDateString()}
                    {p.endDate && ` · End: ${new Date(p.endDate).toLocaleDateString()}`}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

