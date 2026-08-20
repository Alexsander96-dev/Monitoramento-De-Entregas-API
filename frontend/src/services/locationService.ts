import { api } from './api';
import type { LocalizacaoResponse } from '../types';

export const locationService = {
  list: () => api.get<LocalizacaoResponse[]>('/localizacoes'),
  getById: (id: number) => api.get<LocalizacaoResponse>(`/localizacoes/${id}`),
  listByDelivery: (entregaId: number) => api.get<LocalizacaoResponse[]>(`/localizacoes/entrega/${entregaId}`),
};
