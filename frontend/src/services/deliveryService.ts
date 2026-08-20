import { api } from './api';
import type { EntregaRequest, EntregaResponse } from '../types';

export const deliveryService = {
  list: () => api.get<EntregaResponse[]>('/entregas'),
  getById: (id: number) => api.get<EntregaResponse>(`/entregas/${id}`),
  create: (data: EntregaRequest) => api.post<EntregaResponse>('/entregas', data),
  start: (id: number) => api.put<EntregaResponse>(`/entregas/${id}/iniciar`),
  complete: (id: number) => api.put<EntregaResponse>(`/entregas/${id}/concluir`),
  cancel: (id: number) => api.put<EntregaResponse>(`/entregas/${id}/cancelar`),
  fail: (id: number) => api.put<EntregaResponse>(`/entregas/${id}/falha`),
};
