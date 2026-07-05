'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { orderClient } from '@/lib/contracts/order-client';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateOrderPage() {
  const router = useRouter();
  const { publicKey, isConnected } = useWallet();
  const [supplier, setSupplier] = useState('');
  const [shipper, setShipper] = useState('');
  const [inspector, setInspector] = useState('');
  const [amountXlm, setAmountXlm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Connect your wallet first.');
      return;
    }

    if (!supplier || !shipper || !inspector || !amountXlm) {
      toast.error('All fields are required.');
      return;
    }

    if (isNaN(Number(amountXlm)) || Number(amountXlm) <= 0) {
      toast.error('Enter a valid order amount.');
      return;
    }

    try {
      setLoading(true);
      await orderClient.createOrder({
        publicKey,
        supplier,
        shipper,
        inspector,
        amountXlm,
      });

      toast.success('Order created successfully!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-12 animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors mb-6 font-mono uppercase tracking-wider">
        <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO DASHBOARD
      </Link>

      <div className="p-8 border border-hairline bg-surface rounded-xl shadow-soft relative overflow-hidden">
        {/* Helix corner accent lines */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand/30"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand/30"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand/30"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand/30"></div>

        <h2 className="text-xl font-bold text-ink mb-1 font-display tracking-tight uppercase">Create Supply Chain Order</h2>
        <p className="text-2xs font-mono text-ink-faint mb-6 uppercase tracking-wider">
          Define supplier, shipper, inspector, and lockable escrow budget to launch the trade pipeline.
        </p>

        {!isConnected ? (
          <div className="text-center py-8 bg-canvas/30 rounded-lg border border-hairline p-4">
            <span className="material-symbols-outlined text-3xl text-ink-faint mb-2">account_balance_wallet</span>
            <p className="text-xs text-ink-muted font-mono uppercase tracking-wider">Please connect your wallet first.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">
                Supplier Address
              </label>
              <input
                type="text"
                placeholder="G..."
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                disabled={loading}
                className="field-input"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">
                Logistics Shipper Address
              </label>
              <input
                type="text"
                placeholder="G..."
                value={shipper}
                onChange={(e) => setShipper(e.target.value)}
                disabled={loading}
                className="field-input"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">
                Inspector Address
              </label>
              <input
                type="text"
                placeholder="G..."
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                disabled={loading}
                className="field-input"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">
                Order Value (XLM)
              </label>
              <input
                type="number"
                step="0.000001"
                min="0.000001"
                placeholder="100.0"
                value={amountXlm}
                onChange={(e) => setAmountXlm(e.target.value)}
                disabled={loading}
                className="field-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-11 mt-4"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4.5 w-4.5 rounded-full border-2 border-current border-t-transparent"></span>
                  INITIALIZING...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  INITIALIZE ORDER
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
