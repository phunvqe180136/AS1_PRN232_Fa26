'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Home' },
  { href: '/departments', label: 'Departments' },
  { href: '/projects', label: 'Projects' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/search', label: 'Search' },
  { href: '/departments/manage', label: 'Manage Departments' },
  { href: '/projects/manage', label: 'Manage Projects' },
  { href: '/tasks/manage', label: 'Manage Tasks' },
  { href: '/tags/manage', label: 'Manage Tags' },
];

export function Navbar() {
  const path = usePathname();
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3">
        <Link href="/" className="mr-4 text-lg font-bold text-indigo-600">TaskTrack</Link>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={clsx(
            'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap',
            path === l.href ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
          )}>{l.label}</Link>
        ))}
      </div>
    </nav>
  );
}
