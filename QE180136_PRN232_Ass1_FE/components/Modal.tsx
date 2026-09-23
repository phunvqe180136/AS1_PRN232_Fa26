'use client';
import { ReactNode } from 'react';
import clsx from 'clsx';

export function Modal({
  open, onClose, title, children, footer,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className={clsx('w-full max-w-lg rounded-xl bg-white p-6 shadow-xl')} onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">✕</button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open, title, message, onCancel, onConfirm, confirmLabel = 'Delete', danger = true,
}: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void; confirmLabel?: string; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}
      footer={<>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
      </>}>
      <p className="text-sm text-slate-700">{message}</p>
    </Modal>
  );
}
