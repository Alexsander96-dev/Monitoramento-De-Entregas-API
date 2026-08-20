import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { activityChartData } from '../../lib/mockData';

export function ActivityChart() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Atividade de Entregas</h3>
          <p className="text-xs text-slate-500 mt-0.5">Entregas e localizações ao longo do dia</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-400">Entregas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Localizações</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={activityChartData}>
          <defs>
            <linearGradient id="gradEntregas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLocalizacoes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="hora" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f1f5f9',
            }}
          />
          <Area type="monotone" dataKey="entregas" stroke="#6366f1" fill="url(#gradEntregas)" strokeWidth={2} />
          <Area type="monotone" dataKey="localizacoes" stroke="#22c55e" fill="url(#gradLocalizacoes)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
