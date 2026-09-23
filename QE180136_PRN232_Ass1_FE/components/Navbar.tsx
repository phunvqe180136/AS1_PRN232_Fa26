'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Layers,
  Briefcase,
  CheckSquare,
  Search,
  Settings,
  FolderTree,
  ListTodo,
  Tag,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Sparkles },
  { href: '/departments', label: 'Departments', icon: Layers },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/search', label: 'Search', icon: Search },
];

const manageItems = [
  { href: '/departments/manage', label: 'Departments', icon: FolderTree },
  { href: '/projects/manage', label: 'Projects', icon: Briefcase },
  { href: '/tasks/manage', label: 'Tasks', icon: ListTodo },
  { href: '/tags/manage', label: 'Tags', icon: Tag },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                TaskTrack
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 -mt-1">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  )}
                >
                  <Icon className={clsx('h-4 w-4', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Management Quick Links */}
        <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Settings className="h-3 w-3" /> Manage
          </span>
          {manageItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200',
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                )}
              >
                <Icon className={clsx('h-3.5 w-3.5', isActive ? 'text-white' : 'text-slate-500')} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-4 animate-fade-in">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase text-slate-400 px-3 py-1">Navigation</div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold',
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold uppercase text-slate-400 px-3 py-1">Management Hub</div>
            <div className="grid grid-cols-2 gap-2">
              {manageItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border',
                      isActive ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

