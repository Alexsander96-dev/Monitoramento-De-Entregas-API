import { api } from './api';
import type { EntregadorRequest, EntregadorResponse } from '../types';

export const driverService = {
  list: () => api.get<EntregadorResponse[]>('/entregadores'),
  getById: (id: number) => api.get<EntregadorResponse>(`/entregadores/${id}`),
  create: (data: EntregadorRequest) => api.post<EntregadorResponse>('/entregadores', data),
  update: (id: number, data: EntregadorRequest) => api.put<EntregadorResponse>(`/entregadores/${id}`, data),
  delete: (id: number) => api.delete(`/entregadores/${id}`),
};
