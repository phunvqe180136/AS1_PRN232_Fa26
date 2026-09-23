'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Projects, Tags, Tasks } from '@/lib/services';
import { ProjectDto, TagDto, TaskDto } from '@/lib/types';
import { Spinner, EmptyState } from '@/components/States';
import { PageHeader } from '@/components/PageHeader';
import { TaskStatusBadge, PriorityBadge, TagBadge } from '@/components/Badges';
import { TaskStatusOptions, TaskPriorityOptions } from '@/lib/enums';

export default function SearchPage() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<number | ''>('');
  const [priority, setPriority] = useState<number | ''>('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [tagId, setTagId] = useState<number | ''>('');
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [results, setResults] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Projects.list().then(setProjects).catch(() => {});
    Tags.list().then(setTags).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    Tasks.search({
      title: title || undefined,
      status: status === '' ? undefined : Number(status),
      priority: priority === '' ? undefined : Number(priority),
      projectId: projectId === '' ? undefined : Number(projectId),
      tagId: tagId === '' ? undefined : Number(tagId),
    }).then(setResults).finally(() => setLoading(false));
  }, [title, status, priority, projectId, tagId]);

  return (
    <>
      <PageHeader title="Search Tasks" subtitle="Filter tasks by any combination of fields." />
      <div className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. login, design, database..." />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={status} onChange={e => setStatus(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Any Status</option>
            {TaskStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" value={priority} onChange={e => setPriority(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Any Priority</option>
            {TaskPriorityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Project</label>
          <select className="input" value={projectId} onChange={e => setProjectId(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Any Project</option>
            {projects.map(p => {
              const pId = p.projectId ?? p.projectID!;
              return <option key={pId} value={pId}>{p.projectName}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="label">Tag</label>
          <select className="input" value={tagId} onChange={e => setTagId(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Any Tag</option>
            {tags.map(t => {
              const tId = t.tagId ?? t.tagID!;
              return <option key={tId} value={tId}>{t.tagName}</option>;
            })}
          </select>
        </div>
      </div>

      {loading && <Spinner />}
      {results.length === 0 && !loading && <EmptyState title="No tasks match your filters" />}
      <ul className="space-y-2">
        {results.map(t => {
          const tId = t.taskId ?? t.taskID!;
          return (
            <li key={tId} className="card flex items-center justify-between hover:shadow-md transition">
              <div>
                <Link href={`/tasks/${tId}`} className="font-medium text-indigo-700 hover:underline">{t.title}</Link>
                <p className="text-xs text-slate-500">{t.projectName ?? `Project #${t.projectId ?? t.projectID}`}</p>
                {t.tags && t.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.tags.map(x => (
                      <TagBadge key={x.tagId ?? x.tagID} name={x.tagName} color={x.color} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <TaskStatusBadge value={t.status} />
                <PriorityBadge value={t.priority} />
                {t.dueDate && <span className="text-xs text-slate-500">Due {new Date(t.dueDate).toLocaleDateString()}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

