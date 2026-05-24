import { useEffect, useState } from 'react';
import { Bell, RefreshCw, Send } from 'lucide-react';
import { toast } from 'sonner';
import { NotificacaoService, type Notificacao, type StatusNotificacao } from '@/services/notificacaoService';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

const statusStyle: Record<StatusNotificacao, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendente', color: '#D97706', bg: '#FFFBEB' },
  SENT: { label: 'Enviada', color: '#059669', bg: '#ECFDF5' },
  ERROR: { label: 'Erro', color: '#DC2626', bg: '#FEF2F2' },
};

const filters = ['ALL', 'PENDING', 'SENT', 'ERROR'] as const;

export default function Notificacoes() {
  const [notifs, setNotifs] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<(typeof filters)[number]>('ALL');
  const [resending, setResending] = useState(false);
  const [sending, setSending] = useState<number | null>(null);
  const [apiError, setApiError] = useState(false);

  async function load() {
    setLoading(true);
    setApiError(false);
    try {
      setNotifs(await NotificacaoService.list());
    } catch {
      setApiError(true);
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function enviar(id: number) {
    setSending(id);
    try {
      await NotificacaoService.send(id);
      toast.success('Notificação enviada');
      await load();
    } catch {
      toast.error('Erro ao enviar');
    } finally {
      setSending(null);
    }
  }

  async function reenviarErros() {
    setResending(true);
    try {
      await NotificacaoService.resendErrors();
      toast.success('Reenvio iniciado');
      await load();
    } catch {
      toast.error('Erro ao reenviar');
    } finally {
      setResending(false);
    }
  }

  const filtered = filtro === 'ALL' ? notifs : notifs.filter(n => n.status === filtro);
  const erros = notifs.filter(n => n.status === 'ERROR').length;

  return (
    <div>
      <PageHeader
        title="Notificações"
        description={`${notifs.length} notificação(ões) no total`}
        action={
          erros > 0
            ? {
                label: resending ? 'Reenviando...' : `Reenviar ${erros} erro(s)`,
                onClick: reenviarErros,
                icon: RefreshCw,
                disabled: resending,
              }
            : undefined
        }
      />

      {erros > 0 && (
        <div className="mb-4 flex justify-end sm:hidden">
          <Button variant="danger" onClick={reenviarErros} disabled={resending}>
            <RefreshCw className={cn('w-4 h-4', resending && 'animate-spin')} />
            Reenviar erros
          </Button>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFiltro(s)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold border transition',
              filtro === s
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-muted border-slate-200 hover:border-slate-300',
            )}
          >
            {s === 'ALL' ? 'Todas' : statusStyle[s].label}
            {s !== 'ALL' && ` (${notifs.filter(n => n.status === s).length})`}
          </button>
        ))}
      </div>

      <Card padding={false} className="overflow-hidden">
        {loading ? (
          <TableSkeleton cols={5} />
        ) : apiError ? (
          <EmptyState
            icon={Bell}
            title="Não foi possível carregar"
            description="Verifique se o backend de notificações está ativo"
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Bell} title="Nenhuma notificação encontrada" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {['Aluno', 'Telefone', 'Tarefa', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(n => {
                  const s = statusStyle[n.status];
                  return (
                    <tr key={n.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-navy">{n.studentName}</td>
                      <td className="px-5 py-3.5 text-muted">{n.phone}</td>
                      <td className="px-5 py-3.5 text-muted">{n.taskTitle || '—'}</td>
                      <td className="px-5 py-3.5">
                        <Badge color={s.color} bg={s.bg}>{s.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {n.status !== 'SENT' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => enviar(n.id)}
                            disabled={sending === n.id}
                          >
                            <Send className="w-3.5 h-3.5" />
                            {sending === n.id ? '...' : 'Enviar'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
