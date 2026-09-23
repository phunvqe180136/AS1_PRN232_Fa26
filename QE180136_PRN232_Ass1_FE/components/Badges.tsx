'use client';
import { ProjectStatusOptions, TaskStatusOptions, TaskPriorityOptions, labelOf } from '@/lib/enums';
import { Circle, AlertCircle, AlertTriangle, Flame, CheckCircle2, Clock, PauseCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

export function StatusBadge({ value }: { value: number }) {
  const label = labelOf(ProjectStatusOptions, value);
  const configs: Record<number, { bg: string; text: string; border: string; dot: string; icon: React.ComponentType<{ className?: string }> }> = {
    0: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400', icon: Clock },
    1: { bg: 'bg-blue-50/80', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500 animate-pulse-glow', icon: Circle },
    2: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
    3: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: PauseCircle },
  };

  const c = configs[value] ?? configs[0];
  const Icon = c.icon;

  return (
    <span className={clsx('badge shadow-2xs font-medium transition-all', c.bg, c.text, c.border)}>
      <span className={clsx('h-1.5 w-1.5 rounded-full', c.dot)} />
      {label}
    </span>
  );
}

export function TaskStatusBadge({ value }: { value: number }) {
  const label = labelOf(TaskStatusOptions, value);
  const configs: Record<number, { bg: string; text: string; border: string; dot: string; icon: React.ComponentType<{ className?: string }> }> = {
    0: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400', icon: Clock },
    1: { bg: 'bg-indigo-50/80', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500 animate-pulse-glow', icon: Circle },
    2: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
    3: { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500', icon: XCircle },
  };

  const c = configs[value] ?? configs[0];
  return (
    <span className={clsx('badge shadow-2xs font-medium', c.bg, c.text, c.border)}>
      <span className={clsx('h-1.5 w-1.5 rounded-full', c.dot)} />
      {label}
    </span>
  );
}

export function PriorityBadge({ value }: { value: number }) {
  const label = labelOf(TaskPriorityOptions, value);
  const configs: Record<number, { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
    0: { bg: 'bg-slate-50 text-slate-600', border: 'border-slate-200', text: 'text-slate-600', icon: Circle },
    1: { bg: 'bg-sky-50 text-sky-700', border: 'border-sky-200', text: 'text-sky-700', icon: AlertCircle },
    2: { bg: 'bg-amber-50 text-amber-700', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle },
    3: { bg: 'bg-rose-50 text-rose-700 font-bold', border: 'border-rose-200', text: 'text-rose-700', icon: Flame },
  };

  const c = configs[value] ?? configs[0];
  const Icon = c.icon;

  return (
    <span className={clsx('badge gap-1 shadow-2xs font-medium', c.bg, c.text, c.border)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export function TagBadge({ name, color }: { name: string; color?: string | null }) {
  const validColor = color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) ? color : '#6366F1';
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-transform hover:scale-105"
      style={{
        backgroundColor: `${validColor}15`,
        borderColor: `${validColor}40`,
        color: validColor,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: validColor }} />
      {name}
    </span>
  );
}

