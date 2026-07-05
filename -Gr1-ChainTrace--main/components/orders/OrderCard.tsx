import Link from 'next/link';
import { Badge } from '../ui/Badge';
import { stellar } from '@/lib/stellar';
import { FiArrowRight, FiUser, FiTruck, FiSearch } from 'react-icons/fi';
import type { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link href={`/orders/${order.id}`}>
      <div className="card-interactive hover-lift transition-all p-6 flex flex-col justify-between h-full" id={`order-card-${order.id}`}>
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="font-display font-semibold text-ink tracking-tight text-lg">
              Order #{order.id}
            </h3>
            <Badge status={order.status} />
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[10px] text-ink-muted font-mono">
              <span className="flex items-center gap-1.5 uppercase">
                <FiUser className="h-3.5 w-3.5 text-ink-faint" />
                Buyer: {stellar.formatAddress(order.buyer, 4, 4)}
              </span>
              <span className="flex items-center gap-1.5 uppercase">
                <FiUser className="h-3.5 w-3.5 text-ink-faint" />
                Supplier: {stellar.formatAddress(order.supplier, 4, 4)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-ink-muted font-mono">
              <span className="flex items-center gap-1.5 uppercase">
                <FiTruck className="h-3.5 w-3.5 text-ink-faint" />
                Shipper: {stellar.formatAddress(order.shipper, 4, 4)}
              </span>
              <span className="flex items-center gap-1.5 uppercase">
                <FiSearch className="h-3.5 w-3.5 text-ink-faint" />
                Inspector: {stellar.formatAddress(order.inspector, 4, 4)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-hairline flex justify-between items-center">
          <p className="font-display text-xl font-bold text-ink tnum">
            {Number(order.amount).toFixed(2)}{' '}
            <span className="text-xs font-mono font-normal text-ink-muted">XLM</span>
          </p>
          <span className="material-symbols-outlined text-ink-faint group-hover:text-ink transition-colors">chevron_right</span>
        </div>
      </div>
    </Link>
  );
}
