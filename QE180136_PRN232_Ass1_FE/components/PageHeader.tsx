import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  actions,
  action,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  action?: ReactNode;
  badge?: string;
}) {
  const actionContent = actions ?? action;

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          {badge && (
            <span className="badge bg-indigo-50 text-indigo-700 border-indigo-200/80 text-[11px] font-bold">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actionContent && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {actionContent}
        </div>
      )}
    </div>
  );
}
