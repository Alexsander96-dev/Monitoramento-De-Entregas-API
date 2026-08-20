import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, User, Package, Play, CheckCircle2, XCircle, AlertTriangle, Radio } from 'lucide-react';
import { deliveryService } from '../services/deliveryService';
import { orderService } from '../services/orderService';
import { driverService } from '../services/driverService';
import { locationService } from '../services/locationService';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { EntregaResponse, PedidoResponse, EntregadorResponse, LocalizacaoResponse, ConnectionStatus } from '../types';
import { StatusEntrega } from '../types';
import { formatDateTime, formatRelativeTime, cn } from '../lib/utils';

interface DeliveryDetailPageProps {
  connectionStatus: ConnectionStatus;
  onSubscribe: (id: number) => void;
  subscribedEntregaId: number | null;
}

export function DeliveryDetailPage({ connectionStatus, onSubscribe, subscribedEntregaId }: DeliveryDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<EntregaResponse | null>(null);
  const [order, setOrder] = useState<PedidoResponse | null>(null);
  const [driver, setDriver] = useState<EntregadorResponse | null>(null);
  const [locations, setLocations] = useState<LocalizacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  async function loadData(deliveryId: number) {
    try {
      const d = await deliveryService.getById(deliveryId);
      setDelivery(d);

      const [o, locs] = await Promise.all([
        orderService.getById(d.pedidoId),
        locationService.listByDelivery(deliveryId).catch(() => []),
      ]);
      setOrder(o);
      setLocations(locs);

      if (d.entregadorId) {
        const dr = await driverService.getById(d.entregadorId);
        setDriver(dr);
      }
    } catch {
      navigate('/entregas');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action: 'start' | 'complete' | 'cancel' | 'fail') {
    if (!delivery) return;
    try {
      const actions = {
        start: () => deliveryService.start(delivery.id),
        complete: () => deliveryService.complete(delivery.id),
        cancel: () => deliveryService.cancel(delivery.id),
        fail: () => deliveryService.fail(delivery.id),
      };
      await actions[action]();
      await loadData(delivery.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl animate-pulse" style={{ background: 'var(--color-surface-1)' }} />
        ))}
      </div>
    );
  }

  if (!delivery) return null;

  const timelineSteps = [
    { label: 'Pedido Criado', status: 'done' as const, icon: Package },
    {
      label: 'Em Rota',
      status: ((delivery.status === StatusEntrega.EM_ROTA || delivery.status === StatusEntrega.ENTREGUE) ? 'done' : delivery.status === StatusEntrega.CRIADO ? 'pending' : 'skipped') as 'done' | 'pending' | 'active' | 'skipped',
      icon: Play,
    },
    {
      label: 'Entregue',
      status: (delivery.status === StatusEntrega.ENTREGUE ? 'done' : 'pending') as 'done' | 'pending' | 'active' | 'skipped',
      icon: CheckCircle2,
    },
  ];

  if (delivery.status === StatusEntrega.EM_ROTA) {
    timelineSteps[1].status = 'active';
  }

  const isSubscribed = subscribedEntregaId === delivery.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/entregas')} className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Entrega #{delivery.id}</h2>
            <StatusBadge status={delivery.status} size="md" />
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          {delivery.status === StatusEntrega.CRIADO && (
            <button onClick={() => handleAction('start')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
              <Play size={14} /> Iniciar
            </button>
          )}
          {delivery.status === StatusEntrega.EM_ROTA && (
            <>
              <button onClick={() => handleAction('complete')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors border border-green-500/20">
                <CheckCircle2 size={14} /> Concluir
              </button>
              <button onClick={() => handleAction('fail')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                <AlertTriangle size={14} /> Falha
              </button>
            </>
          )}
          {delivery.status === StatusEntrega.CRIADO && (
            <button onClick={() => handleAction('cancel')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20">
              <XCircle size={14} /> Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Info + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-6">Progresso da Entrega</h3>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-center flex-1 relative">
                  {i > 0 && (
                    <div className={cn(
                      'absolute top-4 right-1/2 w-full h-0.5',
                      step.status === 'done' || step.status === 'active' ? 'bg-indigo-500' : 'bg-white/10'
                    )} style={{ transform: 'translateX(50%)' }} />
                  )}
                  <div className={cn(
                    'relative z-10 w-9 h-9 rounded-full flex items-center justify-center',
                    step.status === 'done' ? 'bg-indigo-500 text-white' :
                    step.status === 'active' ? 'bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500' :
                    'bg-white/5 text-slate-500'
                  )}>
                    <step.icon size={16} />
                  </div>
                  <span className={cn(
                    'text-xs mt-2 font-medium',
                    step.status === 'done' || step.status === 'active' ? 'text-slate-200' : 'text-slate-500'
                  )}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-indigo-400" />
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pedido</h4>
              </div>
              <p className="text-sm text-slate-200 font-medium">#{order?.id} — {order?.cliente || '—'}</p>
              <p className="text-xs text-slate-500 mt-1">{order?.endereconEntrega || 'Endereço não informado'}</p>
              <p className="text-xs text-slate-500 mt-1">Criado: {formatDateTime(order?.dataCriacao ?? null)}</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-emerald-400" />
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entregador</h4>
              </div>
              <p className="text-sm text-slate-200 font-medium">{driver?.nome || '—'}</p>
              <p className="text-xs text-slate-500 mt-1">📱 {driver?.telefone || '—'}</p>
              <p className="text-xs text-slate-500 mt-1">Status: {driver?.status || '—'}</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-400" />
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Datas</h4>
              </div>
              <p className="text-xs text-slate-400">Início: <span className="text-slate-200">{formatDateTime(delivery.dataInicio)}</span></p>
              <p className="text-xs text-slate-400 mt-1.5">Conclusão: <span className="text-slate-200">{formatDateTime(delivery.dataConclusao)}</span></p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-rose-400" />
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Última Localização</h4>
              </div>
              {locations.length > 0 ? (
                <>
                  <p className="text-xs text-slate-400">Lat: <span className="text-slate-200 font-mono">{locations[locations.length - 1].latitude}</span></p>
                  <p className="text-xs text-slate-400 mt-1">Lng: <span className="text-slate-200 font-mono">{locations[locations.length - 1].longitude}</span></p>
                  <p className="text-xs text-slate-500 mt-1.5">{formatRelativeTime(locations[locations.length - 1].dataHora)}</p>
                </>
              ) : (
                <p className="text-xs text-slate-500">Nenhuma localização registrada</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column — WebSocket + Locations */}
        <div className="space-y-4">
          {/* Monitor button */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Radio size={16} className="text-indigo-400" />
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitoramento</h4>
            </div>
            <button
              onClick={() => onSubscribe(delivery.id)}
              disabled={connectionStatus !== 'CONNECTED'}
              className={cn(
                'w-full py-2.5 rounded-lg text-sm font-medium transition-colors',
                isSubscribed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-white border border-transparent',
                connectionStatus !== 'CONNECTED' && 'opacity-50 cursor-not-allowed'
              )}
              style={!isSubscribed ? { background: 'var(--color-accent)' } : undefined}
            >
              {isSubscribed ? '✅ Monitorando' : '📡 Monitorar em tempo real'}
            </button>
            {connectionStatus !== 'CONNECTED' && (
              <p className="text-[10px] text-slate-500 mt-2 text-center">WebSocket desconectado</p>
            )}
          </motion.div>

          {/* Location History */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card">
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
              <h4 className="text-sm font-semibold text-slate-200">Histórico de Localizações</h4>
              <p className="text-xs text-slate-500 mt-0.5">{locations.length} registros</p>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
              {locations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">Nenhuma localização</div>
              ) : (
                [...locations].reverse().map(loc => (
                  <div key={loc.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-emerald-400" />
                      <span className="text-xs font-mono text-slate-300">{loc.latitude}, {loc.longitude}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 ml-5">{formatRelativeTime(loc.dataHora)}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
