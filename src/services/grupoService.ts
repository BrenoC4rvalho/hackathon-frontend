import { api } from './api';

export type Grupo = { id: number; name: string; description: string };
export type GrupoRequest = Omit<Grupo, 'id'>;

export const GrupoService = {
  list:   ()                        => api.get<Grupo[]>('/api/groups').then(r => r.data),
  create: (data: GrupoRequest)      => api.post<Grupo>('/api/groups', data).then(r => r.data),
  update: (id: number, data: GrupoRequest) => api.put<Grupo>(`/api/groups/${id}`, data).then(r => r.data),
  remove: (id: number)              => api.delete(`/api/groups/${id}`),
};
