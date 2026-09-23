'use client';
import Link from 'next/link';
import { Projects, Tasks, Stats } from '@/lib/services';
import { useAsync } from '@/lib/useAsync';
import { Spinner, EmptyState, SkeletonCards } from '@/components/States';
import { StatusBadge, TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import {
  MoreHorizontal,
  Calendar,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  FolderKanban,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const mockAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
];

export default function HomePage() {
  const summary = useAsync(() => Stats.summary(), []);
  const projects = useAsync(() => Projects.list(), []);
  const tasks = useAsync(() => Tasks.list(), []);

  // Split tasks into Working / In Progress / Completed
  const workingTasks = tasks.data?.filter((t) => t.status === 0 || t.status === 1).slice(0, 4) ?? [];
  const inProgressTasks = tasks.data?.filter((t) => t.status === 2 || t.status === 1).slice(0, 4) ?? [];
  const completedTasks = tasks.data?.filter((t) => t.status === 3) ?? [];

  const totalTasksCount = tasks.data?.length ?? 0;
  const completedTasksCount = completedTasks.length;
  const progressRatio = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 58;

  const progressColors = [
    'bg-rose-500',
    'bg-sky-500',
    'bg-amber-500',
    'bg-indigo-600',
  ];

  return (
    <div className="space-y-8">
      {/* 1. Top Section: Horizontal Project Progress Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.loading && <SkeletonCards count={4} />}

          {projects.data?.slice(0, 4).map((p, idx) => {
            const pId = p.projectId ?? p.projectID;
            const barColor = progressColors[idx % progressColors.length];
            const progressVal = 7 + (idx % 3);

            return (
              <Link
                key={pId}
                href={`/projects/${pId}`}
                className="group rounded-3xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {p.projectName}
                    </h3>
                    <button className="text-slate-300 hover:text-slate-600" onClick={(e) => e.preventDefault()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {p.departmentName ?? `Dept #${p.departmentId ?? p.departmentID}`}
                  </p>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                      Progress
                    </span>
                    <span className="text-slate-800 font-bold">{progressVal}/10</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${progressVal * 10}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-lg bg-rose-50 text-rose-600 px-2 py-0.5 text-[11px] font-bold">
                    {p.endDate ? new Date(p.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : 'ACTIVE'}
                  </span>

                  <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> 4
                    </span>
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" /> 5
                    </span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {mockAvatars.slice(0, 2).map((av, i) => (
                        <img
                          key={i}
                          src={av}
                          alt="avatar"
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Middle & Right Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Kanban Columns */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Working */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Working</h2>
                <span className="text-xs font-bold text-slate-400">
                  ({String(workingTasks.length).padStart(2, '0')})
                </span>
              </div>
              <Link href="/tasks/manage" className="text-xs font-bold text-indigo-600 hover:underline">
                + Add
              </Link>
            </div>

            <div className="space-y-3.5">
              {workingTasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                  No active working tasks
                </div>
              )}

              {workingTasks.map((t, i) => {
                const tId = t.taskId ?? t.taskID;
                return (
                  <Link
                    key={tId}
                    href={`/tasks/${tId}`}
                    className="block group rounded-3xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {t.title}
                      </h3>
                      <button className="text-slate-300 hover:text-slate-600" onClick={(e) => e.preventDefault()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {t.description || 'Creating a recognizable brand identity is pivotal in ensuring visibility.'}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {t.tags && t.tags.length > 0 ? (
                          t.tags.map((tag) => (
                            <span
                              key={tag.tagId ?? tag.tagID}
                              className="rounded-lg bg-sky-50 text-sky-700 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide border border-sky-100"
                            >
                              {tag.tagName}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="rounded-lg bg-sky-50 text-sky-700 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide border border-sky-100">
                              IOS APP
                            </span>
                            <span className="rounded-lg bg-amber-50 text-amber-700 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide border border-amber-100">
                              ANDROID
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex -space-x-1.5 overflow-hidden">
                        {mockAvatars.slice(i % 2, (i % 2) + 2).map((av, avIdx) => (
                          <img
                            key={avIdx}
                            src={av}
                            alt="member"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">In progress</h2>
                <span className="text-xs font-bold text-slate-400">
                  ({String(inProgressTasks.length).padStart(2, '0')})
                </span>
              </div>
              <Link href="/tasks/manage" className="text-xs font-bold text-indigo-600 hover:underline">
                + Add
              </Link>
            </div>

            <div className="space-y-3.5">
              {inProgressTasks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                  No tasks in progress
                </div>
              )}

              {inProgressTasks.map((t, i) => {
                const tId = t.taskId ?? t.taskID;
                return (
                  <Link
                    key={tId}
                    href={`/tasks/${tId}`}
                    className="block group rounded-3xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {t.title}
                      </h3>
                      <button className="text-slate-300 hover:text-slate-600" onClick={(e) => e.preventDefault()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {t.description || 'Establishing a distinctive brand identity is essential for achieving recognition.'}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-lg bg-sky-50 text-sky-700 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide border border-sky-100">
                          WEBSITE
                        </span>
                        <span className="rounded-lg bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wide border border-indigo-100">
                          BRANDING
                        </span>
                      </div>

                      <div className="flex -space-x-1.5 overflow-hidden">
                        {mockAvatars.slice(1, 3).map((av, avIdx) => (
                          <img
                            key={avIdx}
                            src={av}
                            alt="member"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Task Activity Donut & Member Comments Widgets */}
        <div className="space-y-6">
          {/* Widget 1: Task Activity Donut Chart */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Task Activity</h3>
              <Link
                href="/tasks"
                className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                See More
              </Link>
            </div>

            {/* Circular Donut Graphic */}
            <div className="relative my-6 flex items-center justify-center">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="16"
                />
                {/* Completed (Cyan) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="16"
                  strokeDasharray="283"
                  strokeDashoffset="200"
                  strokeLinecap="round"
                />
                {/* To-Do (Amber) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="16"
                  strokeDasharray="283"
                  strokeDashoffset="140"
                  strokeLinecap="round"
                />
                {/* Progress (Purple/Indigo) */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="transparent"
                  stroke="#4F46E5"
                  strokeWidth="16"
                  strokeDasharray="283"
                  strokeDashoffset="70"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900">{progressRatio}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Completed
                </span>
              </div>
            </div>

            {/* Legends */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                <span>Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>To - Do</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Member Comments / Recent Updates */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Member Comments</h3>
            </div>
            <div className="text-[11px] font-bold text-slate-400 mb-4">
              Today • 23 Sep 2026
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Godwin"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Godwin</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">Creative work man, change the color</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Raji"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Raji</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">Ok Welldone</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Johan"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Johan</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">Good Job Man!</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
