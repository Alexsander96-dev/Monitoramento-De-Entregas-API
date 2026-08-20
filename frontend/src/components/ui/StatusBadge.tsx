import { cn } from '../../lib/utils';
import type { StatusEntrega } from '../../types';
import { statusEntregaConfig } from '../../lib/utils';

interface StatusBadgeProps {
  status: StatusEntrega;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusEntregaConfig[status];
  return (
    <span className={cn(
      'status-badge',
      config.bgColor,
      config.color,
      size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-3 py-1'
    )}>
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
