'use client';
import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastCtx {
  push: (type: Toast['type'], message: string) => void;
}

const Ctx = createContext<ToastCtx>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {items.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5',
              t.type === 'success' &&
                'bg-emerald-950/90 text-emerald-100 border-emerald-800/60 shadow-emerald-950/20',
              t.type === 'error' &&
                'bg-rose-950/90 text-rose-100 border-rose-800/60 shadow-rose-950/20',
              t.type === 'info' &&
                'bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-950/20'
            )}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
              {t.type === 'error' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
              )}
              {t.type === 'info' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Info className="h-5 w-5" />
                </div>
              )}
              <p className="text-sm font-medium leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
