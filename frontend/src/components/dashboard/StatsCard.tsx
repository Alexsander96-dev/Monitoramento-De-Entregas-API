import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  index?: number;
}

export function StatsCard({
  title, value, change, changeType = 'neutral',
  icon: Icon, iconColor, iconBg, index = 0
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="glass-card-hover p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold mt-2 text-slate-100">{value}</p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              changeType === 'positive' ? 'text-emerald-400' :
              changeType === 'negative' ? 'text-red-400' : 'text-slate-400'
            )}>
              {changeType === 'positive' && <TrendingUp size={12} />}
              {changeType === 'negative' && <TrendingDown size={12} />}
              {change}
            </div>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </motion.div>
  );
}
