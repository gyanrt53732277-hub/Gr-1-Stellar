'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { orderClient } from '@/lib/contracts/order-client';
import { escrowClient } from '@/lib/contracts/escrow-client';
import { useEscrow } from '@/hooks/useEscrow';
import { useContractEvents } from '@/hooks/useContractEvents';
import { ORDER_CONTRACT_ID } from '@/lib/constants';
import { stellar } from '@/lib/stellar';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Order } from '@/lib/types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const orderId = Number(id);
  const { publicKey, isConnected } = useWallet();
  const { escrow, refetch: refetchEscrow } = useEscrow(orderId, publicKey || undefined);
  const { events, loading: eventsLoading } = useContractEvents(ORDER_CONTRACT_ID);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!publicKey || !orderId) return;
    try {
      setLoading(true);
      const data = await orderClient.getOrder(orderId, publicKey);
      setOrder(data);
    } catch {
      toast.error('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId, publicKey]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleAction = async (action: () => Promise<{ hash: string }>, successMsg: string) => {
    try {
      setActionLoading(true);
      setTxHash(null);
      const res = await action();
      setTxHash(res.hash);
      toast.success(successMsg);
      await loadOrder();
      await refetchEscrow();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center animate-pulse-soft">
        <span className="animate-spin h-8 w-8 rounded-full border-2 border-brand border-t-transparent inline-block mb-4" />
        <p className="text-ink-muted font-mono text-2xs uppercase tracking-widest">Loading order metadata...</p>
      </div>
    );
  }

  const isBuyer = publicKey && publicKey.toUpperCase() === order.buyer.toUpperCase();
  const isSupplier = publicKey && publicKey.toUpperCase() === order.supplier.toUpperCase();
  const isShipper = publicKey && publicKey.toUpperCase() === order.shipper.toUpperCase();
  const isInspector = publicKey && publicKey.toUpperCase() === order.inspector.toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-8 animate-fade-in">
      {/* Header & Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-ink-faint mb-2 font-mono text-2xs uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-ink transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-ink">Order Details</span>
          </div>
          <h1 className="text-3xl font-bold text-ink font-display tracking-tight sm:text-4xl">Order #{order.id}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Badge status={order.status} />
            <span className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">Created at block ledger {order.createdAt}</span>
          </div>
        </div>

        {/* Action Buttons based on roles */}
        <div className="flex flex-wrap gap-3">
          {order.status === 'created' && isBuyer && (
            <button
              onClick={() =>
                handleAction(
                  () => escrowClient.deposit(publicKey, order.id, order.amount),
                  'Escrow successfully funded!'
                )
              }
              disabled={actionLoading}
              className="btn-primary h-11 px-5"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              FUND ESCROW ({Number(order.amount).toFixed(2)} XLM)
            </button>
          )}

          {order.status === 'funded' && isShipper && (
            <button
              onClick={() =>
                handleAction(
                  () => orderClient.shipOrder(publicKey, order.id),
                  'Cargo marked as shipped!'
                )
              }
              disabled={actionLoading}
              className="btn-primary h-11 px-5"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              DISPATCHED / SHIP ORDER
            </button>
          )}

          {order.status === 'shipped' && isShipper && (
            <button
              onClick={() =>
                handleAction(
                  () => orderClient.deliverOrder(publicKey, order.id),
                  'Cargo marked as delivered!'
                )
              }
              disabled={actionLoading}
              className="btn-primary h-11 px-5"
            >
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              CONFIRM DELIVERY
            </button>
          )}

          {order.status === 'delivered' && isInspector && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleAction(
                    () => orderClient.inspectOrder(publicKey, order.id, true),
                    'Inspection passed! Escrow released.'
                  )
                }
                disabled={actionLoading}
                className="btn-primary h-11 px-5"
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                PASS QUALITY CHECK
              </button>
              <button
                onClick={() =>
                  handleAction(
                    () => orderClient.inspectOrder(publicKey, order.id, false),
                    'Inspection marked as failed.'
                  )
                }
                disabled={actionLoading}
                className="flex items-center gap-2 h-11 px-5 bg-short/12 border border-short/25 text-short font-mono text-2xs tracking-widest uppercase hover:border-short/45 hover:bg-short/18 transition-all active:scale-[0.98] rounded-md font-semibold"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">close</span>
                FAIL QUALITY CHECK
              </button>
            </div>
          )}

          {order.status === 'inspected_failed' && isBuyer && (
            <button
              onClick={() =>
                handleAction(
                  () => orderClient.refundOrder(publicKey, order.id),
                  'Funds successfully refunded!'
                )
              }
              className="flex items-center gap-2 h-11 px-5 bg-short/12 border border-short/25 text-short font-mono text-2xs tracking-widest uppercase hover:border-short/45 hover:bg-short/18 transition-all active:scale-[0.98] rounded-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
              REQUEST ESCROW REFUND
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Spec Grid & Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="border border-hairline bg-surface p-6 rounded-xl relative overflow-hidden">
            {/* Helix corner accent lines */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand/30"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand/30"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand/30"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand/30"></div>

            <h3 className="text-2xs font-bold uppercase tracking-widest text-ink-faint font-mono mb-6">Order Specification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">Order ID</span>
                <div className="text-sm font-semibold text-ink font-mono uppercase tracking-wide">
                  CT-ORDER-{order.id}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">Escrow Value</span>
                <div className="text-sm font-semibold text-ink font-mono tnum">
                  {Number(order.amount).toFixed(2)} <span className="text-2xs text-ink-muted font-normal">XLM</span>
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">Buyer</span>
                <div className="text-xs font-mono bg-canvas/40 p-2.5 rounded-md border border-hairline text-ink-muted truncate">
                  {order.buyer}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">Supplier</span>
                <div className="text-xs font-mono bg-canvas/40 p-2.5 rounded-md border border-hairline text-ink-muted truncate">
                  {order.supplier}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">Logistics Provider</span>
                <div className="text-xs font-mono bg-canvas/40 p-2.5 rounded-md border border-hairline text-ink-muted truncate">
                  {order.shipper}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">Independent Inspector</span>
                <div className="text-xs font-mono bg-canvas/40 p-2.5 rounded-md border border-hairline text-ink-muted truncate">
                  {order.inspector}
                </div>
              </div>
            </div>
          </div>

          {/* Map mockup */}
          <div className="border border-hairline bg-surface rounded-xl overflow-hidden h-64 relative">
            <div className="w-full h-full bg-cover bg-center opacity-30 filter grayscale"
                 style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgZxAdeW7c-C6eiWyDPQz3FVXQ6KLfKS9iXAMq3QpdYU3qHhPGzwbuB0PzCvKOrgiMJxdI3LXvVTUWWZYiP9P8SxAYlUshinuD1TqSUS0iGfcsLvab8e8lZm-0eGS2p7VvLqOBbldEz1kD3Vc1fBnyzEIKw1qQ-g4AE69jfof05vDKtZux0pH5UKmRz8ChX_Os977-rlS_lJoDdOsyIRFrP3fu9VJMfk03FtJC7Fg2AZL7JVIAMw-m0p7vo74Mn_k6bBHMLDFOssY')` }} />
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute top-4 left-4 bg-canvas/80 backdrop-blur-md text-ink px-4 py-2 rounded-md border border-hairline">
              <div className="text-[10px] font-mono uppercase tracking-widest text-ink-faint">Current Location</div>
              <div className="text-xs font-semibold font-mono uppercase tracking-wider mt-0.5">Maritime Transit Zone</div>
            </div>
            <div className="absolute bottom-4 right-4 bg-elevated/40 backdrop-blur-md text-ink px-4 py-2 rounded-md border border-hairline flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-long animate-pulse"></span>
              Real-time Telemetry Active
            </div>
          </div>

          {/* Action confirmation link */}
          {txHash && (
            <div className="bg-long/10 p-4 rounded-xl border border-long/20 flex justify-between items-center text-xs animate-slide-up">
              <span className="text-long/80 font-mono tracking-wider uppercase text-2xs">Transaction hash:</span>
              <a
                href={stellar.getExplorerLink(txHash, 'tx')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-long hover:text-long/80 hover:underline flex items-center gap-1 font-bold tracking-wider uppercase"
              >
                {stellar.formatAddress(txHash, 6, 6)}
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Ledger Event Logs & Document Verifications */}
        <div className="lg:col-span-4 space-y-8">
          {/* On-Chain Event Ledger */}
          <div className="border border-hairline bg-surface text-ink p-6 rounded-xl flex flex-col h-[400px] relative overflow-hidden">
            {/* Helix corner accents */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand/30"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand/30"></div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xs font-mono uppercase tracking-widest font-bold text-ink-faint">On-Chain Event Ledger</h3>
              <span className="material-symbols-outlined text-ink-faint">security</span>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
              {eventsLoading ? (
                <div className="space-y-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-14 animate-pulse-soft bg-canvas/30 border border-hairline rounded-md" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-2xs font-mono uppercase tracking-wider text-ink-faint italic">No events captured yet.</p>
              ) : (
                events.map((evt) => (
                  <div key={evt.id} className="group border-l border-hairline pl-4 py-1 hover:border-ink transition-colors">
                    <div className="flex justify-between items-start mb-1 text-2xs font-mono uppercase tracking-wider">
                      <span className="font-bold text-ink">{evt.topic.join(' / ')}</span>
                      <span className="text-ink-faint">L{evt.ledger}</span>
                    </div>
                    <p className="text-[10px] font-mono text-ink-muted line-clamp-2">
                      Value:{' '}
                      {JSON.stringify(evt.value, (_, v) =>
                        typeof v === 'bigint' ? v.toString() : v
                      )}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-mono text-[9px] text-ink-faint tracking-wider">{stellar.formatAddress(evt.txHash, 6, 6)}</span>
                      <a
                        href={stellar.getExplorerLink(evt.txHash, 'tx')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-faint hover:text-ink hover:underline text-[9px] tracking-wider font-mono uppercase flex items-center gap-0.5 font-semibold"
                      >
                        VIEW <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Verification documents mockup */}
          <div className="border border-hairline bg-surface p-6 rounded-xl relative">
            <h4 className="text-2xs font-bold font-mono uppercase tracking-widest text-ink-faint mb-4">Verification Files</h4>
            <ul className="space-y-3 font-mono">
              <li className="flex items-center justify-between p-2.5 hover:bg-elevated/40 rounded-md transition-all group cursor-pointer border border-hairline bg-canvas/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-ink-faint text-lg">description</span>
                  <span className="text-2xs tracking-wider font-semibold text-ink uppercase">BILL_OF_LADING.PDF</span>
                </div>
                <span className="material-symbols-outlined text-ink-faint group-hover:text-ink transition-colors text-sm">download</span>
              </li>
              <li className="flex items-center justify-between p-2.5 hover:bg-elevated/40 rounded-md transition-all group cursor-pointer border border-hairline bg-canvas/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-ink-faint text-lg">verified</span>
                  <span className="text-2xs tracking-wider font-semibold text-ink uppercase">INSPECTION_REPORT.SIG</span>
                </div>
                <span className="material-symbols-outlined text-ink-faint group-hover:text-ink transition-colors text-sm">download</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
