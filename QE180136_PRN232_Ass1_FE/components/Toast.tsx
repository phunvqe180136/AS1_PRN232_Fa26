'use client';
import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface Toast { id: number; type: 'success' | 'error' | 'info'; message: string }
interface ToastCtx { push: (type: Toast['type'], message: string) => void }

const Ctx = createContext<ToastCtx>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, type, message }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {items.map(t => (
          <div key={t.id} className={'rounded-md px-4 py-2 text-sm text-white shadow-lg ' +
            (t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-slate-800')}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
