import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { paths } from '@/routes/paths';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8 text-accent" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold text-navy mb-2">404</h1>
      <p className="text-muted text-sm text-center max-w-sm mb-8">
        A página que você procura não existe ou foi movida.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.history.back()}>
          Voltar
        </Button>
        <Link to={paths.home}>
          <Button>Ir para o início</Button>
        </Link>
      </div>
    </div>
  );
}
