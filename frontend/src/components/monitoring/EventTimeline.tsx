import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plug, AlertTriangle, Radio, Trash2 } from 'lucide-react';
import type { WebSocketEvent } from '../../types';
import { formatTime, cn } from '../../lib/utils';

interface EventTimelineProps {
  events: WebSocketEvent[];
  maxItems?: number;
  onClear?: () => void;
  compact?: boolean;
}

const eventIcons = {
  location: MapPin,
  connection: Plug,
  error: AlertTriangle,
  subscription: Radio,
  status: Radio,
};

const eventColors = {
  location: 'text-emerald-400 bg-emerald-500/10',
  connection: 'text-blue-400 bg-blue-500/10',
  error: 'text-red-400 bg-red-500/10',
  subscription: 'text-indigo-400 bg-indigo-500/10',
  status: 'text-amber-400 bg-amber-500/10',
};

export function EventTimeline({ events, maxItems = 50, onClear, compact = false }: EventTimelineProps) {
  const displayEvents = events.slice(0, maxItems);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Eventos em Tempo Real</h3>
          {events.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
              {events.length}
            </span>
          )}
        </div>
        {onClear && events.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={12} />
            Limpar
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1" style={{ maxHeight: compact ? 300 : 500 }}>
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Radio size={32} className="mb-3 opacity-30" />
            <p className="text-sm">Nenhum evento ainda</p>
            <p className="text-xs mt-1">Conecte-se ao WebSocket para ver eventos</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {displayEvents.map(event => {
              const Icon = eventIcons[event.type];
              const colorClass = eventColors[event.type];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    'flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    'hover:bg-white/[0.02]'
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', colorClass)}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 leading-snug">{event.message}</p>
                    {event.data && 'latitude' in event.data && (
                      <div className="flex gap-4 mt-1.5 text-xs text-slate-500">
                        <span>Lat: {String(event.data.latitude)}</span>
                        <span>Lng: {String(event.data.longitude)}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-600 mt-1">
                      {formatTime(event.timestamp)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
