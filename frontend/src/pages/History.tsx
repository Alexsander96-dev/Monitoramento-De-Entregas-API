import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, RefreshCw } from 'lucide-react';
import { locationService } from '../services/locationService';
import type { LocalizacaoResponse } from '../types';
import { formatDateTime, formatRelativeTime } from '../lib/utils';

export function HistoryPage() {
  const [locations, setLocations] = useState<LocalizacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await locationService.list();
      setLocations(data.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()));
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Histórico de Localizações</h2>
          <p className="text-xs text-slate-500 mt-0.5">{locations.length} registros encontrados</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}>
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: 'var(--color-surface-2)' }} />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <Clock size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Nenhuma localização registrada</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {locations.map(loc => (
              <div key={loc.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/10">
                    <MapPin size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-200">
                      Entrega <span className="font-mono font-medium">#{loc.entregaId}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {loc.latitude}, {loc.longitude}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{formatDateTime(loc.dataHora)}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatRelativeTime(loc.dataHora)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
