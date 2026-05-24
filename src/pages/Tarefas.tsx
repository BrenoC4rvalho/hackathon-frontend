import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Pencil,
  Trash2,
  Plus,
  Bell,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { TarefaService, type Tarefa, type TipoTarefa } from '@/services/tarefaService';
import { GrupoService, type Grupo } from '@/services/grupoService';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/hooks/useConfirm';
import { formatDate } from '@/lib/format';
import { getApiErrorMessage } from '@/lib/apiError';

const empty = { title: '', description: '', type: 'PROVA' as TipoTarefa, dueDate: '', groupId: 0 };

const tipoBadge: Record<TipoTarefa, { label: string; color: string; bg: string }> = {
  PROVA: { label: 'Prova', color: '#DC2626', bg: '#FEF2F2' },
  TRABALHO: { label: 'Trabalho', color: '#D97706', bg: '#FFFBEB' },
  AVISO: { label: 'Aviso', color: '#2563EB', bg: '#EFF6FF' },
  EVENTO: { label: 'Evento', color: '#059669', bg: '#ECFDF5' },
};

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'criar' | 'editar' | null>(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);
  const { confirm } = useConfirm();

  async function load() {
    setLoading(true);
    try {
      const [t, g] = await Promise.all([TarefaService.list(), GrupoService.list()]);
      setTarefas(t);
      setGrupos(g);
    } catch {
      toast.error('Erro ao carregar tarefas');
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  function openCriar() {
    setForm(empty);
    setErro('');
    setModal('criar');
  }
  function openEditar(t: Tarefa) {
    setForm({
      title: t.title,
      description: t.description,
      type: t.type,
      dueDate: t.dueDate,
      groupId: t.groupId,
    });
    setEditId(t.id);
    setErro('');
    setModal('editar');
  }
  function fechar() {
    setModal(null);
    setEditId(null);
  }

  async function salvar() {
    if (!form.title || !form.groupId || !form.dueDate) {
      setErro('Título, grupo e data são obrigatórios.');
      return;
    }
    setSaving(true);
    setErro('');
    try {
      if (modal === 'criar') await TarefaService.create(form);
      else if (modal === 'editar' && editId) await TarefaService.update(editId, form);
      toast.success(modal === 'criar' ? 'Tarefa criada' : 'Tarefa atualizada');
      await load();
      fechar();
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Erro ao salvar tarefa.'));
    } finally {
      setSaving(false);
    }
  }

  function pedirExclusao(id: number) {
    confirm({
      title: 'Excluir tarefa',
      message: 'Notificações vinculadas podem ser afetadas.',
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        try {
          await TarefaService.remove(id);
          toast.success('Tarefa excluída');
          await load();
        } catch (err) {
          toast.error(getApiErrorMessage(err, 'Erro ao excluir'));
        }
      },
    });
  }

  async function gerarNotificacoes(id: number) {
    setActionId(id);
    try {
      await TarefaService.gerarNotificacoes(id);
      toast.success('Notificações geradas');
    } catch {
      toast.error('Erro ao gerar notificações');
    } finally {
      setActionId(null);
    }
  }

  async function enviarWhatsapp(id: number) {
    setActionId(id);
    try {
      await TarefaService.enviarWhatsapp(id);
      toast.success('WhatsApp enviado');
    } catch {
      toast.error('Erro ao enviar WhatsApp');
    } finally {
      setActionId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Tarefas acadêmicas"
        description={`${tarefas.length} tarefa(s) cadastrada(s)`}
        action={{ label: 'Nova Tarefa', onClick: openCriar, icon: Plus }}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : tarefas.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma tarefa cadastrada"
            description="Crie uma tarefa para gerar notificações automáticas"
            action={{ label: 'Nova Tarefa', onClick: openCriar }}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {tarefas.map(t => {
            const badge = tipoBadge[t.type];
            const busy = actionId === t.id;
            return (
              <Card key={t.id} className="!p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge color={badge.color} bg={badge.bg}>{badge.label}</Badge>
                      {t.groupName && (
                        <Badge color="var(--accent)" bg="#EEF2FF">{t.groupName}</Badge>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(t.dueDate)}
                      </span>
                    </div>
                    <p className="font-semibold text-navy mb-1">{t.title}</p>
                    {t.description && <p className="text-xs text-muted">{t.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => openEditar(t)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => pedirExclusao(t.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button variant="dark" size="sm" onClick={() => gerarNotificacoes(t.id)} disabled={busy}>
                    <Bell className="w-3.5 h-3.5" />
                    Gerar notificações
                  </Button>
                  <Button variant="success" size="sm" onClick={() => enviarWhatsapp(t.id)} disabled={busy}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    Enviar WhatsApp
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={fechar}
        title={modal === 'criar' ? 'Nova Tarefa' : 'Editar Tarefa'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" className="flex-1" onClick={fechar}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={salvar} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Prova de Cálculo I" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Tipo" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as TipoTarefa })}>
              {Object.entries(tipoBadge).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
            <Input label="Data" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <Select label="Grupo" value={form.groupId} onChange={e => setForm({ ...form, groupId: Number(e.target.value) })}>
            <option value={0}>Selecione um grupo...</option>
            {grupos.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Select>
          <Textarea label="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          {erro && <p className="text-red-500 text-xs">{erro}</p>}
        </div>
      </Modal>

    </div>
  );
}
