export const ProjectStatusOptions = [
  { value: 0, label: 'Not Started', color: 'bg-slate-100 text-slate-700 ring-slate-300' },
  { value: 1, label: 'In Progress', color: 'bg-blue-100 text-blue-700 ring-blue-300' },
  { value: 2, label: 'Completed', color: 'bg-emerald-100 text-emerald-700 ring-emerald-300' },
  { value: 3, label: 'On Hold', color: 'bg-amber-100 text-amber-700 ring-amber-300' },
];

export const TaskStatusOptions = [
  { value: 0, label: 'To Do', color: 'bg-slate-100 text-slate-700 ring-slate-300' },
  { value: 1, label: 'In Progress', color: 'bg-blue-100 text-blue-700 ring-blue-300' },
  { value: 2, label: 'Done', color: 'bg-emerald-100 text-emerald-700 ring-emerald-300' },
  { value: 3, label: 'Cancelled', color: 'bg-red-100 text-red-700 ring-red-300' },
];

export const TaskPriorityOptions = [
  { value: 0, label: 'Low', color: 'bg-slate-100 text-slate-700 ring-slate-300' },
  { value: 1, label: 'Medium', color: 'bg-sky-100 text-sky-700 ring-sky-300' },
  { value: 2, label: 'High', color: 'bg-orange-100 text-orange-700 ring-orange-300' },
  { value: 3, label: 'Critical', color: 'bg-red-100 text-red-700 ring-red-300' },
];

export function labelOf(list: { value: number; label: string }[], v: number) {
  return list.find(x => x.value === v)?.label ?? `Unknown (${v})`;
}
export function colorOf(list: { value: number; color: string }[], v: number) {
  return list.find(x => x.value === v)?.color ?? 'bg-slate-100 text-slate-700 ring-slate-300';
}
