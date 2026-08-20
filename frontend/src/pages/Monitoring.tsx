import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Send, Radio, Zap, RotateCw, MessageSquare } from 'lucide-react';
import { EventTimeline } from '../components/monitoring/EventTimeline';
import type { ConnectionStatus, WebSocketEvent } from '../types';
import { cn } from '../lib/utils';

interface MonitoringPageProps {
  connectionStatus: ConnectionStatus;
  events: WebSocketEvent[];
  messagesReceived: number;
  reconnections: number;
  onConnect: () => void;
  onDisconnect: () => void;
  onSubscribe: (id: number) => void;
  onUnsubscribe: () => void;
  onSendLocation: (id: number, lat: string, lng: string) => void;
  onClearEvents: () => void;
  subscribedEntregaId: number | null;
}

export function MonitoringPage({
  connectionStatus, events, messagesReceived, reconnections,
  onConnect, onDisconnect, onSubscribe, onUnsubscribe,
  onSendLocation, onClearEvents, subscribedEntregaId,
}: MonitoringPageProps) {
  const [entregaId, setEntregaId] = useState('1');
  const [latitude, setLatitude] = useState('-23.5505');
  const [longitude, setLongitude] = useState('-46.6333');

  const isConnected = connectionStatus === 'CONNECTED';

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            {isConnected ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-red-400" />}
            <span className="text-xs text-slate-400">Status</span>
          </div>
          <p className={cn('text-sm font-semibold', isConnected ? 'text-emerald-400' : 'text-red-400')}>
            {isConnected ? 'Conectado' : connectionStatus === 'CONNECTING' ? 'Conectando...' : 'Desconectado'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} className="text-indigo-400" />
            <span className="text-xs text-slate-400">Mensagens</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{messagesReceived}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <RotateCw size={14} className="text-amber-400" />
            <span className="text-xs text-slate-400">Reconexões</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{reconnections}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Radio size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-400">Inscrição</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {subscribedEntregaId ? `Entrega #${subscribedEntregaId}` : 'Nenhuma'}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Connection */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              Conexão WebSocket
            </h3>
            <div className="flex gap-2">
              <button
                onClick={onConnect}
                disabled={isConnected}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isConnected ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-white'
                )}
                style={!isConnected ? { background: 'var(--color-accent)' } : { background: 'var(--color-surface-3)' }}
              >
                Conectar
              </button>
              <button
                onClick={onDisconnect}
                disabled={!isConnected}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border',
                  !isConnected ? 'opacity-40 cursor-not-allowed text-slate-400 border-transparent' : 'text-red-400 bg-red-500/10 border-red-500/20'
                )}
              >
                Desconectar
              </button>
            </div>
          </div>

          {/* Subscribe */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Radio size={14} className="text-emerald-400" />
              Inscrição em Entrega
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ID da Entrega</label>
                <input
                  type="number"
                  min="1"
                  value={entregaId}
                  onChange={e => setEntregaId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSubscribe(Number(entregaId))}
                  disabled={!isConnected}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Inscrever
                </button>
                <button
                  onClick={onUnsubscribe}
                  disabled={!subscribedEntregaId}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-400 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border-subtle)' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          {/* Send Location */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Send size={14} className="text-amber-400" />
              Enviar Localização
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Latitude</label>
                  <input
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none font-mono"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Longitude</label>
                  <input
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none font-mono"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}
                  />
                </div>
              </div>
              <button
                onClick={() => onSendLocation(Number(entregaId), latitude, longitude)}
                disabled={!isConnected}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--color-accent)' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Send size={14} />
                  Enviar
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Event Timeline */}
        <div className="lg:col-span-2">
          <EventTimeline events={events} onClear={onClearEvents} />
        </div>
      </div>
    </div>
  );
}
