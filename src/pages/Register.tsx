import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { AuthPanel } from '@/components/AuthPanel';
import { paths } from '@/routes/paths';
import { getApiErrorMessage } from '@/lib/apiError';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await AuthService.register(form);
      navigate(paths.login);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao cadastrar. Verifique os dados e tente novamente.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthPanel
        headline={
          <>
            Comece agora e mantenha seus{' '}
            <span className="text-accent-light">alunos ativos.</span>
          </>
        }
        subtext="Crie sua conta em segundos e automatize suas notificações acadêmicas."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <span className="font-bold text-2xl text-navy">
              Campus <span className="text-accent">Notify</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-navy mb-1">Criar conta</h1>
          <p className="text-sm text-muted mb-8">Preencha os dados abaixo para começar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
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
                  Cadastrando...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Já possui conta?{' '}
            <Link to={paths.login} className="font-semibold text-accent hover:text-indigo-500">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
