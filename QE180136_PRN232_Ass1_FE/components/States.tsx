'use client';
import { ReactNode } from 'react';
import { Loader2, FolderKanban, Sparkles } from 'lucide-react';

export function Spinner({
  label = 'Loading data...',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 text-slate-500 dark:text-slate-400 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-100 dark:border-indigo-950/60" />
        <Loader2 className="absolute h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
      <p className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300">
        {label}
      </p>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="card-glass overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-pulse">
      <div className="bg-slate-50/70 dark:bg-slate-900/70 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-6 py-4 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={`h-3 bg-slate-100 dark:bg-slate-800 rounded ${c === 0 ? 'w-1/4' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-glass p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16" />
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/6" />
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
  icon,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="card-glass border border-dashed border-slate-300/80 dark:border-slate-800 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
        {icon || <FolderKanban className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      {hint && (
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
