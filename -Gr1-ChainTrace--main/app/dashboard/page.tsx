'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/orders/OrderCard';
import Link from 'next/link';

export default function DashboardPage() {
  const { publicKey, isConnected, connect } = useWallet();
  const { orders, loading } = useOrders(publicKey || undefined);
  const [activeTab, setActiveTab] = useState<'all' | 'buyer' | 'supplier' | 'shipper' | 'inspector'>('all');

  const filteredOrders = orders.filter((order) => {
    if (!publicKey) return false;
    const pub = publicKey.toUpperCase();
    if (activeTab === 'buyer') return order.buyer.toUpperCase() === pub;
    if (activeTab === 'supplier') return order.supplier.toUpperCase() === pub;
    if (activeTab === 'shipper') return order.shipper.toUpperCase() === pub;
    if (activeTab === 'inspector') return order.inspector.toUpperCase() === pub;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <p className="eyebrow">CONSOLE // CORE</p>
          <h1 className="text-3xl font-bold text-ink font-display tracking-tight sm:text-4xl">Trade Dashboard</h1>
          <p className="text-sm text-ink-muted">Track your supply chain orders and escrow milestones with on-chain precision.</p>
        </div>
        {isConnected && (
          <Link href="/orders/create">
            <button className="btn-primary h-11 px-5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">add</span>
              NEW ORDER
            </button>
          </Link>
        )}
      </div>

      {/* Role Filter Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-hairline pb-2">
        {([
          { id: 'all', label: 'As All' },
          { id: 'buyer', label: 'As Buyer' },
          { id: 'supplier', label: 'As Supplier' },
          { id: 'shipper', label: 'As Shipper' },
          { id: 'inspector', label: 'As Inspector' },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap border ${
                isActive
                  ? 'bg-elevated text-ink border-line'
                  : 'bg-transparent border-transparent text-ink-muted hover:text-ink hover:bg-elevated/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Disconnected Alert State */}
      {!isConnected ? (
        <div className="mb-8 border border-hairline bg-surface/50 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-4 py-16">
          <div className="w-16 h-16 rounded-xl bg-elevated/60 border border-hairline flex items-center justify-center text-ink-muted">
            <span className="material-symbols-outlined text-[32px]">account_balance_wallet</span>
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-ink font-display tracking-tight mb-1">Wallet Disconnected</h3>
            <p className="text-xs text-ink-muted leading-relaxed">Please connect your wallet using the button in the top right to view your dashboard and manage your trade smart contracts.</p>
          </div>
          <button
            onClick={() => connect('freighter')}
            className="btn-primary mt-2"
          >
            CONNECT NOW
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border border-hairline bg-surface p-6 rounded-xl h-56 flex flex-col justify-between overflow-hidden relative">
                  <div className="space-y-3">
                    <div className="w-20 h-4 bg-elevated rounded-md animate-pulse-soft"></div>
                    <div className="w-full h-8 bg-elevated rounded-md animate-pulse-soft"></div>
                    <div className="w-2/3 h-4 bg-elevated rounded-md animate-pulse-soft"></div>
                  </div>
                  <div className="w-full h-2 bg-elevated rounded-md animate-pulse-soft"></div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="border border-hairline bg-surface/30 p-12 rounded-xl text-center py-20">
              <span className="material-symbols-outlined text-4xl text-ink-faint mb-2">inbox</span>
              <p className="text-xs text-ink-muted font-mono uppercase tracking-wider">No orders found matching this role filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {/* Network Live Status Section */}
          <div className="border-t border-hairline pt-8 mt-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-ink-faint">sync</span>
              <h3 className="text-2xs font-bold font-mono text-ink-faint uppercase tracking-widest">Network Live Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border border-hairline bg-surface p-6 rounded-xl h-44 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-20 h-4 bg-elevated rounded-md"></div>
                    <div className="w-full h-6 bg-elevated rounded-md"></div>
                  </div>
                  <div className="w-full h-2 bg-elevated rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
