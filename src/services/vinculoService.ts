import { api } from './api';

export type Vinculo = {
  id: number;
  studentId: number;
  studentName: string;
  groupId: number;
  groupName: string;
};

export const VinculoService = {
  list:   ()                                     => api.get<Vinculo[]>('/api/student-groups').then(r => r.data),
  create: (studentId: number, groupId: number)   => api.post<Vinculo>('/api/student-groups', { studentId, groupId }).then(r => r.data),
  remove: (id: number)                           => api.delete(`/api/student-groups/${id}`),
};
