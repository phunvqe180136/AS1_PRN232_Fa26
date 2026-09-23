'use client';
import { ProjectStatusOptions, TaskStatusOptions, TaskPriorityOptions, colorOf, labelOf } from '@/lib/enums';
import clsx from 'clsx';

export function StatusBadge({ value }: { value: number }) {
  return <span className={clsx('badge', colorOf(ProjectStatusOptions, value))}>{labelOf(ProjectStatusOptions, value)}</span>;
}
export function TaskStatusBadge({ value }: { value: number }) {
  return <span className={clsx('badge', colorOf(TaskStatusOptions, value))}>{labelOf(TaskStatusOptions, value)}</span>;
}
export function PriorityBadge({ value }: { value: number }) {
  return <span className={clsx('badge', colorOf(TaskPriorityOptions, value))}>{labelOf(TaskPriorityOptions, value)}</span>;
}
export function TagBadge({ name, color }: { name: string; color?: string | null }) {
  return (
    <span className="badge ring-slate-200 bg-slate-50 text-slate-700"
          style={color ? { backgroundColor: `${color}20`, color: color } : undefined}>
      {name}
    </span>
  );
}
