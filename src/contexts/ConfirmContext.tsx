import { createContext, useCallback, useContext, useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export type ConfirmOptions = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = useCallback((options: ConfirmOptions) => {
    setState(options);
  }, []);

  const cancel = useCallback(() => setState(null), []);

  const runConfirm = useCallback(async () => {
    if (!state) return;
    setLoading(true);
    try {
      await state.onConfirm();
      setState(null);
    } finally {
      setLoading(false);
    }
  }, [state]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <ConfirmDialog
          open
          title={state.title}
          message={state.message}
          confirmLabel={state.confirmLabel ?? 'Confirmar'}
          variant={state.variant ?? 'danger'}
          onConfirm={runConfirm}
          onCancel={cancel}
          loading={loading}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used inside ConfirmProvider');
  }
  return ctx;
}
