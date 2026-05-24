import { api } from './api';

export type TipoTarefa = 'PROVA' | 'TRABALHO' | 'AVISO' | 'EVENTO';
export type Tarefa = {
  id: number;
  title: string;
  description: string;
  type: TipoTarefa;
  dueDate: string;
  groupId: number;
  groupName?: string;
};
export type TarefaRequest = Omit<Tarefa, 'id' | 'groupName'>;

export const TarefaService = {
  list:              ()                    => api.get<Tarefa[]>('/api/academic-tasks').then(r => r.data),
  create:            (d: TarefaRequest)    => api.post<Tarefa>('/api/academic-tasks', d).then(r => r.data),
  update:            (id: number, d: TarefaRequest) => api.put<Tarefa>(`/api/academic-tasks/${id}`, d).then(r => r.data),
  remove:            (id: number)          => api.delete(`/api/academic-tasks/${id}`),
  gerarNotificacoes: (id: number)          => api.post(`/api/academic-tasks/${id}/notifications`),
  enviarWhatsapp:    (id: number)          => api.post(`/api/academic-tasks/${id}/send-whatsapp`),
};
