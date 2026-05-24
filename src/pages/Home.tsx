import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ClipboardList,
  Bell,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AlunoService } from '@/services/alunoService';
import { GrupoService } from '@/services/grupoService';
import { TarefaService } from '@/services/tarefaService';
import { NotificacaoService } from '@/services/notificacaoService';
import { paths } from '@/routes/paths';
import { StatCardsSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

const statConfig = [
  { key: 'alunos' as const, label: 'Alunos', icon: GraduationCap, path: paths.alunos, color: 'bg-indigo-500' },
  { key: 'grupos' as const, label: 'Grupos', icon: Users, path: paths.grupos, color: 'bg-violet-500' },
  { key: 'tarefas' as const, label: 'Tarefas', icon: ClipboardList, path: paths.tarefas, color: 'bg-amber-500' },
  { key: 'notificacoes' as const, label: 'Notificações', icon: Bell, path: paths.notificacoes, color: 'bg-emerald-500' },
];

const quickActions = [
  { label: 'Nova Tarefa', path: paths.tarefas, icon: ClipboardList },
  { label: 'Novo Aluno', path: paths.alunos, icon: GraduationCap },
  { label: 'Novo Grupo', path: paths.grupos, icon: Users },
  { label: 'Notificações', path: paths.notificacoes, icon: Bell },
  { label: 'WhatsApp', path: paths.whatsapp, icon: MessageCircle },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, string | null>>({
    alunos: null,
    grupos: null,
    tarefas: null,
    notificacoes: null,
  });
  const loading = Object.values(stats).some(v => v === null);

  useEffect(() => {
    Promise.allSettled([
      AlunoService.list(),
      GrupoService.list(),
      TarefaService.list(),
      NotificacaoService.list(),
    ]).then(([a, g, t, n]) => {
      setStats({
        alunos: a.status === 'fulfilled' ? String(a.value.length) : '0',
        grupos: g.status === 'fulfilled' ? String(g.value.length) : '0',
        tarefas: t.status === 'fulfilled' ? String(t.value.length) : '0',
        notificacoes: n.status === 'fulfilled' ? String(n.value.length) : '0',
      });
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy tracking-tight">
          Olá, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted mt-0.5">
          Painel de controle — Campus Notify
        </p>
      </div>

      {loading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statConfig.map(({ key, label, icon: Icon, path, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => navigate(path)}
              className="group bg-white rounded-2xl p-5 border border-slate-100 text-left transition hover:shadow-[var(--shadow-card-hover)] hover:border-slate-200"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4', color)}>
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-navy mb-0.5">{stats[key]}</p>
              <p className="text-xs font-medium text-muted flex items-center gap-1">
                {label}
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-bold text-base text-navy mb-4">Acesso rápido</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ label, path, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(path)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-indigo-500 transition"
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
