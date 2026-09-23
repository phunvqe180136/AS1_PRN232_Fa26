'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  CheckSquare2,
  Tag,
  Search,
  Settings,
  Sparkles,
  Layers,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  HelpCircle,
  PlusCircle,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare2 },
  { name: 'Tags', href: '/tags/manage', icon: Tag },
  { name: 'Global Search', href: '/search', icon: Search },
];

const manageItems = [
  { name: 'Manage Projects', href: '/projects/manage' },
  { name: 'Manage Departments', href: '/departments/manage' },
  { name: 'Manage Tasks', href: '/tasks/manage' },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-200/80 bg-white min-h-screen p-6 select-none">
      <div className="space-y-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              Task<span className="text-indigo-600">Minder</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block -mt-1">
              PRN232 • QE180136
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Icon
                  className={clsx(
                    'h-5 w-5 transition-colors',
                    active ? 'text-white' : 'text-slate-400'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Management Hub Section */}
        <div className="space-y-1 pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Management Hub
          </div>
          {manageItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                )}
              >
                <span>{item.name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Promotion / Assignment Card (Matches Image) */}
      <div className="mt-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-5 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-3 text-white border border-white/20">
          <FileText className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-bold leading-snug">PRN232 Assignment 1</h4>
        <p className="mt-1 text-xs text-indigo-100/80 leading-relaxed">
          Full public CRUD, soft delete &amp; advanced search filters.
        </p>
        <Link
          href="/tasks/manage"
          className="mt-3 block w-full rounded-xl bg-white py-2 text-center text-xs font-bold text-indigo-700 shadow hover:bg-indigo-50 transition transform active:scale-95"
        >
          Manage Tasks
        </Link>
      </div>
    </aside>
  );
}
