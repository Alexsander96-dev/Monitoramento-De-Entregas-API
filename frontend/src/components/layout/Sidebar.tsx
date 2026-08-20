import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Radio, Map, Clock, Settings,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import type { ConnectionStatus } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  connectionStatus: ConnectionStatus;
  messagesReceived: number;
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/entregas', icon: Package, label: 'Entregas' },
  { path: '/monitoramento', icon: Radio, label: 'Monitoramento' },
  { path: '/mapa', icon: Map, label: 'Mapa' },
  { path: '/historico', icon: Clock, label: 'Histórico' },
  { path: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar({ connectionStatus, messagesReceived }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isConnected = connectionStatus === 'CONNECTED';

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r"
      style={{
        background: 'var(--color-surface-1)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-accent)' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="5" cy="18" r="3" />
            <circle cx="19" cy="18" r="3" />
            <path d="M10 18h4" />
            <path d="M12 18l-2-5h5l2 5" />
            <path d="M19 18l-3-9h-3" />
            <path d="M14 9H9l-2 4h7z" />
            <rect x="5" y="9" width="5" height="5" rx="1" />
          </svg>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg whitespace-nowrap overflow-hidden"
            >
              MotoTrack
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              )
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'var(--color-accent-glow)', color: 'var(--color-accent-hover)' }
                : undefined
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer — Connection Status */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg',
          collapsed ? 'justify-center' : '',
        )} style={{ background: 'var(--color-surface-2)' }}>
          <div className={cn(
            'pulse-dot flex-shrink-0',
            isConnected ? 'pulse-dot-success' : 'pulse-dot-danger'
          )} />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-medium text-slate-300 whitespace-nowrap">
                  {isConnected ? 'Conectado' : connectionStatus === 'CONNECTING' ? 'Conectando...' : 'Desconectado'}
                </p>
                {isConnected && (
                  <p className="text-[10px] text-slate-500 whitespace-nowrap">
                    {messagesReceived} msg recebidas
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="w-full mt-2 flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
