import { useEffect, useState } from 'react';
import { Users, Pencil, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { GrupoService, type Grupo } from '@/services/grupoService';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/hooks/useConfirm';
import { getApiErrorMessage } from '@/lib/apiError';

const empty = { name: '', description: '' };

export default function Grupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'criar' | 'editar' | null>(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [search, setSearch] = useState('');
  const { confirm } = useConfirm();

  async function load() {
    setLoading(true);
    try {
      setGrupos(await GrupoService.list());
    } catch {
      toast.error('Erro ao carregar grupos');
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
  function openEditar(g: Grupo) {
    setForm({ name: g.name, description: g.description });
    setEditId(g.id);
    setErro('');
    setModal('editar');
  }
  function fechar() {
    setModal(null);
    setEditId(null);
  }

  async function salvar() {
    if (!form.name) {
      setErro('Nome é obrigatório.');
      return;
    }
    setSaving(true);
    setErro('');
    try {
      if (modal === 'criar') await GrupoService.create(form);
      else if (modal === 'editar' && editId) await GrupoService.update(editId, form);
      toast.success(modal === 'criar' ? 'Grupo criado' : 'Grupo atualizado');
      await load();
      fechar();
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Erro ao salvar.'));
    } finally {
      setSaving(false);
    }
  }

  function pedirExclusao(id: number) {
    confirm({
      title: 'Excluir grupo',
      message: 'Alunos vinculados podem ser afetados.',
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        try {
          await GrupoService.remove(id);
          toast.success('Grupo excluído');
          await load();
        } catch (err) {
          toast.error(getApiErrorMessage(err, 'Erro ao excluir'));
        }
      },
    });
  }

  const filtered = grupos.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Grupos"
        description={`${grupos.length} grupo(s) cadastrado(s)`}
        action={{ label: 'Novo Grupo', onClick: openCriar, icon: UserPlus }}
      />

      <Card padding={false} className="overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar grupo..." />
        </div>

        {loading ? (
          <CardGridSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum grupo encontrado"
            description="Organize alunos em grupos para enviar notificações"
            action={{ label: 'Novo Grupo', onClick: openCriar }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filtered.map(g => (
              <div
                key={g.id}
                className="border border-slate-100 rounded-xl p-4 hover:shadow-[var(--shadow-card-hover)] hover:border-slate-200 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm">
                    {g.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEditar(g)}
                      className="p-1.5 rounded-lg text-muted hover:bg-slate-100 hover:text-navy"
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => pedirExclusao(g.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-sm text-navy mb-1">{g.name}</p>
                <p className="text-xs text-muted line-clamp-2">{g.description || 'Sem descrição'}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={!!modal}
        onClose={fechar}
        title={modal === 'criar' ? 'Novo Grupo' : 'Editar Grupo'}
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
          <Input label="Nome do grupo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Turma A - 2026" />
          <Textarea label="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrição opcional..." rows={3} />
          {erro && <p className="text-red-500 text-xs">{erro}</p>}
        </div>
      </Modal>

    </div>
  );
}
