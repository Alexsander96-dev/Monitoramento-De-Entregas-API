import { useEffect, useState } from 'react';
import { Package, Scooter, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { EventTimeline } from '../components/monitoring/EventTimeline';
import { StatusBadge } from '../components/ui/StatusBadge';
import { deliveryService } from '../services/deliveryService';
import type { EntregaResponse, WebSocketEvent, DashboardStats } from '../types';
import { StatusEntrega } from '../types';
import { formatRelativeTime } from '../lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  events: WebSocketEvent[];
}

export function DashboardPage({ events }: DashboardPageProps) {
  const [deliveries, setDeliveries] = useState<EntregaResponse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, emTransito: 0, entregues: 0, falhas: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await deliveryService.list();
      setDeliveries(data);
      setStats({
        total: data.length,
        emTransito: data.filter(d => d.status === StatusEntrega.EM_ROTA).length,
        entregues: data.filter(d => d.status === StatusEntrega.ENTREGUE).length,
        falhas: data.filter(d => d.status === StatusEntrega.FALHA || d.status === StatusEntrega.CANCELADO).length,
      });
    } catch {
      // API may not have data yet
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Entregas"
          value={stats.total}
          change="+12.4% hoje"
          changeType="positive"
          icon={Package}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          index={0}
        />
        <StatsCard
          title="Em Trânsito"
          value={stats.emTransito}
          change="Ativas agora"
          changeType="neutral"
          icon={Scooter}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          index={1}
        />
        <StatsCard
          title="Entregues"
          value={stats.entregues}
          change="+8.2% hoje"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          index={2}
        />
        <StatsCard
          title="Falhas / Canceladas"
          value={stats.falhas}
          change={stats.falhas > 0 ? 'Requer atenção' : 'Nenhuma falha'}
          changeType={stats.falhas > 0 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
          index={3}
        />
      </div>

      {/* Chart + Events side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ActivityChart />
        </div>
        <div className="lg:col-span-2">
          <EventTimeline events={events} maxItems={10} compact />
        </div>
      </div>

      {/* Recent Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <h3 className="text-sm font-semibold text-slate-200">Últimas Entregas</h3>
          <button
            onClick={() => navigate('/entregas')}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Ver todas →
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--color-surface-2)' }} />
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-slate-500">
            <Package size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Nenhuma entrega encontrada</p>
            <p className="text-xs mt-1">Crie pedidos e entregadores para começar</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {deliveries.slice(0, 5).map(delivery => (
              <div
                key={delivery.id}
                onClick={() => navigate(`/entregas/${delivery.id}`)}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-slate-400">#{delivery.id}</span>
                  <StatusBadge status={delivery.status} />
                </div>
                <div className="text-xs text-slate-500">
                  {delivery.dataInicio ? formatRelativeTime(delivery.dataInicio) : 'Não iniciada'}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
