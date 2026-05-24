import { api } from './api';

export type Aluno = {
  id: number;
  name: string;
  registrationNumber: string;
  phoneNumber: string;
  birthDate: string;
};
export type AlunoRequest = Omit<Aluno, 'id'>;

export const AlunoService = {
  list:   ()                              => api.get<Aluno[]>('/api/students').then(r => r.data),
  create: (data: AlunoRequest)            => api.post<Aluno>('/api/students', data).then(r => r.data),
  update: (id: number, d: AlunoRequest)   => api.put<Aluno>(`/api/students/${id}`, d).then(r => r.data),
  remove: (id: number)                    => api.delete(`/api/students/${id}`),
};
