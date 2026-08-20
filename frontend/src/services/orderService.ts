import { api } from './api';
import type { PedidoRequest, PedidoResponse } from '../types';

export const orderService = {
  list: () => api.get<PedidoResponse[]>('/pedidos'),
  getById: (id: number) => api.get<PedidoResponse>(`/pedidos/${id}`),
  create: (data: PedidoRequest) => api.post<PedidoResponse>('/pedidos', data),
  update: (id: number, data: PedidoRequest) => api.put<PedidoResponse>(`/pedidos/${id}`, data),
  delete: (id: number) => api.delete(`/pedidos/${id}`),
};
