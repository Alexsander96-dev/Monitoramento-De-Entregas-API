// ==========================================
// Types — Monitoramento de Entregas API
// ==========================================

// --- Enums ---

export type StatusEntrega = 'CRIADO' | 'AGUARDANDO_ENTREGADOR' | 'EM_ROTA' | 'ENTREGUE' | 'CANCELADO' | 'FALHA';
export const StatusEntrega = {
  CRIADO: 'CRIADO',
  AGUARDANDO_ENTREGADOR: 'AGUARDANDO_ENTREGADOR',
  EM_ROTA: 'EM_ROTA',
  ENTREGUE: 'ENTREGUE',
  CANCELADO: 'CANCELADO',
  FALHA: 'FALHA',
} as const;

export type StatusEntregador = 'DISPONIVEL' | 'EM_ENTREGA' | 'OFFLINE';
export const StatusEntregador = {
  DISPONIVEL: 'DISPONIVEL',
  EM_ENTREGA: 'EM_ENTREGA',
  OFFLINE: 'OFFLINE',
} as const;

export type StatusPedido = 'PENDENTE' | 'EM_ROTA' | 'ENTREGUE' | 'CANCELADO' | 'FALHA';
export const StatusPedido = {
  PENDENTE: 'PENDENTE',
  EM_ROTA: 'EM_ROTA',
  ENTREGUE: 'ENTREGUE',
  CANCELADO: 'CANCELADO',
  FALHA: 'FALHA',
} as const;

// --- DTOs de Request ---

export interface EntregaRequest {
  pedidoId: number;
  entregadorId: number;
}

export interface EntregadorRequest {
  nome: string;
  telefone: string;
}

export interface PedidoRequest {
  cliente: string;
  enderecoEntrega: string;
}

export interface LocalizacaoRequest {
  latitude: string;
  longitude: string;
  entregaId: number;
}

export interface LocalizacaoWebSocketRequest {
  latitude: string;
  longitude: string;
}

// --- DTOs de Response ---

export interface EntregaResponse {
  id: number;
  pedidoId: number;
  entregadorId: number | null;
  status: StatusEntrega;
  dataInicio: string | null;
  dataConclusao: string | null;
}

export interface EntregadorResponse {
  id: number;
  nome: string;
  telefone: string;
  status: StatusEntregador;
}

export interface PedidoResponse {
  id: number;
  cliente: string;
  endereconEntrega: string; // Nota: typo no backend, mantemos para compatibilidade
  status: StatusPedido;
  dataCriacao: string | null;
}

export interface LocalizacaoResponse {
  id: number;
  latitude: string;
  longitude: string;
  dataHora: string;
  entregaId: number;
}

export interface LocalizacaoWebSocketResponse {
  localizacaoId: number;
  entregaId: number;
  latitude: string;
  longitude: string;
  dataHora: string;
}

// --- WebSocket ---

export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export interface WebSocketEvent {
  id: string;
  type: 'location' | 'status' | 'error' | 'connection' | 'subscription';
  message: string;
  data?: LocalizacaoWebSocketResponse | Record<string, unknown>;
  timestamp: Date;
  entregaId?: number;
}

// --- UI / Dashboard ---

export interface DashboardStats {
  total: number;
  emTransito: number;
  entregues: number;
  falhas: number;
}

// --- Entrega Enriquecida (frontend) ---

export interface EntregaEnriquecida extends EntregaResponse {
  pedido?: PedidoResponse;
  entregador?: EntregadorResponse;
  ultimaLocalizacao?: LocalizacaoResponse;
}
