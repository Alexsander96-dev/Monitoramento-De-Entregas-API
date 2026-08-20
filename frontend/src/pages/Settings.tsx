import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Users, ShoppingBag, RefreshCw } from 'lucide-react';
import { orderService } from '../services/orderService';
import { driverService } from '../services/driverService';
import type { PedidoResponse, EntregadorResponse } from '../types';
import { statusPedidoConfig, statusEntregadorConfig, cn } from '../lib/utils';

export function SettingsPage() {
  const [orders, setOrders] = useState<PedidoResponse[]>([]);
  const [drivers, setDrivers] = useState<EntregadorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({ cliente: '', enderecoEntrega: '' });
  const [newDriver, setNewDriver] = useState({ nome: '', telefone: '' });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [o, d] = await Promise.all([orderService.list(), driverService.list()]);
      setOrders(o);
      setDrivers(d);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function createOrder() {
    if (!newOrder.cliente || !newOrder.enderecoEntrega) return;
    try {
      await orderService.create(newOrder);
      setNewOrder({ cliente: '', enderecoEntrega: '' });
      setShowOrderForm(false);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  }

  async function createDriver() {
    if (!newDriver.nome || !newDriver.telefone) return;
    try {
      await driverService.create(newDriver);
      setNewDriver({ nome: '', telefone: '' });
      setShowDriverForm(false);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro');
    }
  }

  async function deleteOrder(id: number) {
    try { await orderService.delete(id); await loadData(); } catch (err) { alert(err instanceof Error ? err.message : 'Erro'); }
  }

  async function deleteDriver(id: number) {
    try { await driverService.delete(id); await loadData(); } catch (err) { alert(err instanceof Error ? err.message : 'Erro'); }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100">Configurações do Sistema</h2>
        <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)' }}>
          <RefreshCw size={14} className={cn(loading && 'animate-spin')} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-200">Pedidos</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">{orders.length}</span>
            </div>
            <button onClick={() => setShowOrderForm(p => !p)} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors">
              <Plus size={12} /> Novo
            </button>
          </div>

          {showOrderForm && (
            <div className="px-5 py-4 border-b space-y-3" style={{ borderColor: 'var(--color-border-subtle)', background: 'var(--color-surface-2)' }}>
              <input placeholder="Nome do cliente" value={newOrder.cliente} onChange={e => setNewOrder(p => ({ ...p, cliente: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }} />
              <input placeholder="Endereço de entrega" value={newOrder.enderecoEntrega} onChange={e => setNewOrder(p => ({ ...p, enderecoEntrega: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }} />
              <button onClick={createOrder} className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--color-accent)' }}>Criar Pedido</button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">Nenhum pedido</div>
            ) : orders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm text-slate-200">#{o.id} — {o.cliente}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{o.endereconEntrega}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', statusPedidoConfig[o.status].bgColor, statusPedidoConfig[o.status].color)}>
                    {statusPedidoConfig[o.status].label}
                  </span>
                  <button onClick={() => deleteOrder(o.id)} className="p-1 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Drivers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">Entregadores</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">{drivers.length}</span>
            </div>
            <button onClick={() => setShowDriverForm(p => !p)} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors">
              <Plus size={12} /> Novo
            </button>
          </div>

          {showDriverForm && (
            <div className="px-5 py-4 border-b space-y-3" style={{ borderColor: 'var(--color-border-subtle)', background: 'var(--color-surface-2)' }}>
              <input placeholder="Nome do entregador" value={newDriver.nome} onChange={e => setNewDriver(p => ({ ...p, nome: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }} />
              <input placeholder="Telefone" value={newDriver.telefone} onChange={e => setNewDriver(p => ({ ...p, telefone: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 outline-none" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }} />
              <button onClick={createDriver} className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--color-accent)' }}>Criar Entregador</button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {drivers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">Nenhum entregador</div>
            ) : drivers.map(d => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-sm text-slate-200">{d.nome}</p>
                  <p className="text-xs text-slate-500 mt-0.5">📱 {d.telefone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', statusEntregadorConfig[d.status].bgColor, statusEntregadorConfig[d.status].color)}>
                    {statusEntregadorConfig[d.status].label}
                  </span>
                  <button onClick={() => deleteDriver(d.id)} className="p-1 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
