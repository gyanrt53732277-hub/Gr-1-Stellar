'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { stellar } from '@/lib/stellar';
import { FiCheck, FiCopy, FiCreditCard, FiLogOut } from 'react-icons/fi';

const walletOptions = [
  { id: 'freighter', label: 'Freighter', note: 'Browser extension' },
  { id: 'xbull', label: 'xBull', note: 'Extension / WalletConnect' },
  { id: 'albedo', label: 'Albedo', note: 'Link-based wallet' },
];

export default function WalletButton() {
  const { publicKey, isConnected, balance, loading, error, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isConnected) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {/* Balance display */}
        <div className="inline-flex h-10 items-center gap-2 rounded-none border border-white/20 bg-black/40 backdrop-blur-sm px-3 text-xs font-mono tracking-widest text-white">
          <span className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse" />
          {balance} XLM
        </div>

        {/* Address and copy button */}
        <button
          onClick={handleCopy}
          className="btn-secondary h-10 px-3 text-xs"
          title="Copy address"
        >
          {copied ? (
            <FiCheck className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <FiCopy className="h-3.5 w-3.5 text-white/60" />
          )}
          <span className="font-mono text-white ml-1.5">{stellar.formatAddress(publicKey || '', 4, 4)}</span>
        </button>

        {/* Disconnect button */}
        <button
          onClick={disconnect}
          className="btn-secondary h-10 px-3"
          title="Disconnect"
        >
          <FiLogOut className="h-4 w-4 text-white/60" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={loading}
        className="btn-primary px-4 h-10"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <FiCreditCard className="h-4 w-4" />
        )}
        {loading ? 'CONNECTING...' : 'CONNECT WALLET'}
      </button>

      {dropdownOpen && !loading && (
        <div className="absolute right-0 top-12 z-50 w-60 rounded-none border border-white/20 bg-black p-2 shadow-lg animate-slide-up">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                setDropdownOpen(false);
                connect(wallet.id);
              }}
              className="flex w-full items-center gap-3 rounded-none px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
            >
              <div>
                <p className="font-mono text-white">{wallet.label.toUpperCase()}</p>
                <p className="text-[10px] font-mono text-white/50">{wallet.note.toUpperCase()}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="absolute right-0 top-12 mt-1 max-w-xs text-xs font-mono text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
