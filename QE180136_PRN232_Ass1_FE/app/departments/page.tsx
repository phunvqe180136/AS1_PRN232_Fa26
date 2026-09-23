'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Departments } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';

export default function DepartmentsPage() {
  const [name, setName] = useState('');
  const list = useAsync(() => name.trim() ? Departments.search(name) : Departments.list(), [name]);

  return (
    <>
      <PageHeader title="Departments" subtitle="Click a department to see its projects." />

      <div className="mb-6 flex gap-2">
        <input className="input" placeholder="Search departments by name..."
               value={name} onChange={e => setName(e.target.value)} />
      </div>

      {list.loading && <Spinner />}
      {list.error && <div className="text-red-600">{list.error}</div>}
      {list.data && list.data.length === 0 && <EmptyState title="No departments found" />}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.data?.map(d => {
          const dId = d.departmentId ?? d.departmentID;
          return (
            <Link key={dId} href={`/departments/${dId}`} className="card hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{d.departmentName}</h3>
                <span className="badge bg-slate-100 text-slate-600 ring-slate-300">{d.projectCount ?? 0} projects</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{d.departmentDescription}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

