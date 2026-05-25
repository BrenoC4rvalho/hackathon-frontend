import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { AuthPanel } from '@/components/AuthPanel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { paths } from '@/routes/paths';
import { getApiErrorMessage } from '@/lib/apiError';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuthContext();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session') === 'expired';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await AuthService.login(form);
      await refresh();
      navigate(paths.home);
    } catch (err) {
      setError(getApiErrorMessage(err, 'E-mail ou senha inválidos.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthPanel
        headline={
          <>
            Gerencie tarefas acadêmicas com{' '}
            <span className="text-accent-light">inteligência.</span>
          </>
        }
        subtext="Notificações automáticas, grupos de alunos e acompanhamento em tempo real."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <span className="font-bold text-2xl text-navy">
              Campus <span className="text-accent">Notify</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-navy mb-1">Bem-vindo de volta</h1>
          <p className="text-sm text-muted mb-8">Entre na sua conta para continuar</p>

          {sessionExpired && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-4">
              Sua sessão expirou. Faça login novamente.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Não possui conta?{' '}
            <Link to={paths.register} className="font-semibold text-accent hover:text-indigo-500">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
