import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
      <p className="text-sm text-muted font-medium">Carregando...</p>
    </div>
  );
}
