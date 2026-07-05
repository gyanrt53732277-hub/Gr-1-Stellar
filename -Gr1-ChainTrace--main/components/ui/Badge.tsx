import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';

interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const norm = status.toLowerCase();
  const colors = STATUS_COLORS[norm] || {
    bg: 'bg-zinc-800 text-zinc-300',
    dot: 'bg-zinc-500',
  };
  const label = STATUS_LABELS[norm] || status;

  return (
    <span className={`status-badge ${colors.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}
