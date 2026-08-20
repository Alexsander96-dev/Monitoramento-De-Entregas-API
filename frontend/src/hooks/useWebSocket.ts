import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ConnectionStatus, LocalizacaoWebSocketRequest, LocalizacaoWebSocketResponse, WebSocketEvent } from '../types';
import { generateId } from '../lib/utils';

const WS_URL = 'http://localhost:8080/ws';
const RECONNECT_DELAY = 5000;
const MAX_EVENTS = 100;

interface UseWebSocketReturn {
  status: ConnectionStatus;
  events: WebSocketEvent[];
  messagesReceived: number;
  reconnections: number;
  connect: () => void;
  disconnect: () => void;
  subscribe: (entregaId: number) => void;
  unsubscribe: () => void;
  sendLocation: (entregaId: number, location: LocalizacaoWebSocketRequest) => void;
  subscribedEntregaId: number | null;
  clearEvents: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [events, setEvents] = useState<WebSocketEvent[]>([]);
  const [messagesReceived, setMessagesReceived] = useState(0);
  const [reconnections, setReconnections] = useState(0);
  const [subscribedEntregaId, setSubscribedEntregaId] = useState<number | null>(null);

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const addEvent = useCallback((event: Omit<WebSocketEvent, 'id' | 'timestamp'>) => {
    const newEvent: WebSocketEvent = {
      ...event,
      id: generateId(),
      timestamp: new Date(),
    };
    setEvents(prev => [newEvent, ...prev].slice(0, MAX_EVENTS));
  }, []);

  const connect = useCallback(() => {
    if (clientRef.current?.connected) return;

    setStatus('CONNECTING');
    addEvent({ type: 'connection', message: 'Conectando ao servidor...' });

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: RECONNECT_DELAY,
      debug: (msg) => console.log('[STOMP]', msg),

      onConnect: () => {
        setStatus('CONNECTED');
        addEvent({ type: 'connection', message: '✅ Conexão STOMP estabelecida com sucesso' });
      },

      onStompError: (frame) => {
        setStatus('ERROR');
        addEvent({
          type: 'error',
          message: `❌ Erro STOMP: ${frame.headers['message'] || 'Erro desconhecido'}`,
          data: { body: frame.body } as Record<string, unknown>,
        });
      },

      onWebSocketError: () => {
        setStatus('ERROR');
        addEvent({ type: 'error', message: '❌ Erro na conexão WebSocket' });
      },

      onDisconnect: () => {
        setStatus('DISCONNECTED');
        addEvent({ type: 'connection', message: '🔌 Sessão STOMP encerrada' });
      },

      onWebSocketClose: () => {
        setReconnections(prev => prev + 1);
      },
    });

    clientRef.current = client;
    client.activate();
  }, [addEvent]);

  const disconnect = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      setSubscribedEntregaId(null);
    }

    if (clientRef.current) {
      await clientRef.current.deactivate();
      clientRef.current = null;
    }

    setStatus('DISCONNECTED');
    addEvent({ type: 'connection', message: '🔌 Desconectado manualmente' });
  }, [addEvent]);

  const subscribe = useCallback((entregaId: number) => {
    if (!clientRef.current?.connected) {
      addEvent({ type: 'error', message: '❌ Conecte-se antes de se inscrever' });
      return;
    }

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    const destination = `/topic/entregas/${entregaId}`;

    subscriptionRef.current = clientRef.current.subscribe(destination, (message) => {
      try {
        const location: LocalizacaoWebSocketResponse = JSON.parse(message.body);
        setMessagesReceived(prev => prev + 1);
        addEvent({
          type: 'location',
          message: `📍 Entrega #${entregaId} atualizou localização`,
          data: location,
          entregaId,
        });
      } catch {
        addEvent({
          type: 'error',
          message: `Mensagem recebida de ${destination}: ${message.body}`,
          entregaId,
        });
      }
    });

    setSubscribedEntregaId(entregaId);
    addEvent({
      type: 'subscription',
      message: `📡 Inscrito em ${destination}`,
      entregaId,
    });
  }, [addEvent]);

  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      addEvent({
        type: 'subscription',
        message: `📡 Inscrição cancelada`,
        entregaId: subscribedEntregaId ?? undefined,
      });
      setSubscribedEntregaId(null);
    }
  }, [addEvent, subscribedEntregaId]);

  const sendLocation = useCallback((entregaId: number, location: LocalizacaoWebSocketRequest) => {
    if (!clientRef.current?.connected) {
      addEvent({ type: 'error', message: '❌ Conecte-se antes de enviar localização' });
      return;
    }

    const destination = `/app/entregas/${entregaId}/localizacao`;

    clientRef.current.publish({
      destination,
      body: JSON.stringify(location),
    });

    addEvent({
      type: 'location',
      message: `📤 Localização enviada para Entrega #${entregaId}`,
      data: { ...location, entregaId } as unknown as Record<string, unknown>,
      entregaId,
    });
  }, [addEvent]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return {
    status,
    events,
    messagesReceived,
    reconnections,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendLocation,
    subscribedEntregaId,
    clearEvents,
  };
}
