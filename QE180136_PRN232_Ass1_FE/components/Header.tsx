'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Layers,
  FolderKanban,
  Building2,
  CheckSquare2,
  Tag,
  PlusCircle,
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4">
      {/* Left: Greeting & Page Subtitle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden rounded-xl p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Hello, PhuNV 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            Lets organize your Daily Projects &amp; Tasks
          </p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            placeholder="Search tasks, projects, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="h-10 w-10 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">Phu Nguyen</div>
            <div className="text-[11px] font-medium text-slate-400 leading-tight">Admin User</div>
          </div>
          <ChevronDown className="hidden sm:block h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 z-50 bg-white p-6 shadow-2xl space-y-6 overflow-y-auto animate-in slide-in-from-top-4">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 px-2">Navigation</div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold"
            >
              <Layers className="h-5 w-5 text-indigo-600" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold"
            >
              <FolderKanban className="h-5 w-5 text-indigo-600" />
              <span>Projects</span>
            </Link>
            <Link
              href="/departments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold"
            >
              <Building2 className="h-5 w-5 text-indigo-600" />
              <span>Departments</span>
            </Link>
            <Link
              href="/tasks"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold"
            >
              <CheckSquare2 className="h-5 w-5 text-indigo-600" />
              <span>Tasks</span>
            </Link>
            <Link
              href="/tags/manage"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold"
            >
              <Tag className="h-5 w-5 text-indigo-600" />
              <span>Tags</span>
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-semibold"
            >
              <Search className="h-5 w-5 text-indigo-600" />
              <span>Search</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 px-2">Management</div>
            <Link
              href="/projects/manage"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-slate-700 font-medium"
            >
              Manage Projects
            </Link>
            <Link
              href="/departments/manage"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-slate-700 font-medium"
            >
              Manage Departments
            </Link>
            <Link
              href="/tasks/manage"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-sm text-slate-700 font-medium"
            >
              Manage Tasks
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
