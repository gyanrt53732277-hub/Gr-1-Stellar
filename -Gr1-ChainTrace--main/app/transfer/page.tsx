'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { stellar } from '@/lib/stellar';
import toast from 'react-hot-toast';

export default function TransferPage() {
  const { publicKey, isConnected, balance, refreshBalance } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    try {
      setLoading(true);
      setTxStatus('idle');
      setTxHash('');
      setErrorMsg('');

      const res = await stellar.sendXlmTransaction(publicKey, recipient, amount);

      setTxStatus('success');
      setTxHash(res.hash);
      toast.success('Transaction submitted successfully!');
      
      setRecipient('');
      setAmount('');
      setMemo('');
      
      await refreshBalance();
    } catch (err: unknown) {
      setTxStatus('error');
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <p className="eyebrow">CONSOLE // ASSETS</p>
        <h1 className="text-3xl font-bold text-ink font-display tracking-tight sm:text-4xl">Direct XLM Payment</h1>
        <p className="text-sm text-ink-muted">Send instant Stellar Testnet payments with real-time balance checks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-xl border border-hairline bg-surface shadow-soft relative overflow-hidden">
            {/* Helix corner accent lines */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand/30"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand/30"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand/30"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand/30"></div>

            {!isConnected ? (
              <div className="text-center py-12 bg-canvas/30 rounded-lg border border-hairline p-6">
                <span className="material-symbols-outlined text-4xl text-ink-faint mb-3">account_balance_wallet</span>
                <p className="text-xs text-ink-muted font-mono uppercase tracking-wider leading-relaxed">
                  Please connect your wallet using the button in the top right to start transfers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <label className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest" htmlFor="address">
                    Recipient Address (G...)
                  </label>
                  <div className="relative">
                    <input
                      id="address"
                      type="text"
                      placeholder="e.g. GCFN...3CKA"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      disabled={loading}
                      required
                      className="field-input pr-10"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-ink-faint text-sm">contact_page</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest" htmlFor="amount">
                      Amount (XLM)
                    </label>
                    <div className="relative">
                      <input
                        id="amount"
                        type="number"
                        step="0.0000001"
                        min="0.0000001"
                        placeholder="10.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                        required
                        className="field-input pr-12"
                      />
                      <span className="absolute right-4 top-3 text-[10px] tracking-wider font-bold font-mono text-ink-faint">XLM</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest">
                      Current Balance
                    </label>
                    <div className="h-11 flex items-center px-3 bg-canvas/30 rounded-md border border-hairline">
                      <span className="font-mono text-ink-muted text-sm">{balance} XLM</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-bold text-ink-faint font-mono uppercase tracking-widest" htmlFor="memo">
                    Memo (Optional)
                  </label>
                  <input
                    id="memo"
                    type="text"
                    placeholder="Internal Reference ID"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    disabled={loading}
                    className="field-input"
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
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      SEND XLM PAYMENT
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Success Dialog */}
          {txStatus === 'success' && txHash && (
            <div className="animate-fade-in">
              <div className="bg-long/10 p-5 rounded-xl border border-long/20 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-long"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-long flex items-center justify-center text-canvas">
                    <span className="material-symbols-outlined">check</span>
                  </div>
                  <div>
                    <p className="font-bold font-mono uppercase tracking-wider text-long text-sm">Transaction Broadcasted</p>
                    <p className="text-long/80 font-mono text-2xs mt-0.5 tracking-wide">Your payment is being processed on the Stellar Network.</p>
                  </div>
                </div>
                <div className="mt-2 pt-3 border-t border-long/20">
                  <p className="text-[10px] font-bold font-mono text-long/80 uppercase tracking-widest mb-1">Transaction Hash</p>
                  <div className="flex items-center justify-between bg-canvas/30 rounded-md p-2 border border-long/10">
                    <code className="text-xs font-mono text-long truncate w-64">{txHash}</code>
                    <a
                      href={stellar.getExplorerLink(txHash, 'tx')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-long hover:text-long/80 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1"
                    >
                      View <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Dialog */}
          {txStatus === 'error' && errorMsg && (
            <div className="animate-fade-in">
              <div className="bg-short/10 p-5 rounded-xl border border-short/20 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-short"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-short flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">error</span>
                  </div>
                  <div>
                    <p className="font-bold font-mono uppercase tracking-wider text-short text-sm">Transaction Failed</p>
                    <p className="text-short/85 font-mono text-2xs tracking-wide mt-0.5 leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Status info */}
        <div className="md:col-span-5 flex flex-col gap-6">
          {/* Network Integrity */}
          <div className="p-6 rounded-xl border border-hairline bg-surface relative overflow-hidden">
            <h3 className="text-2xs font-bold font-mono text-ink-faint mb-4 uppercase tracking-widest">Network Integrity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-ink-muted">
                <span>Stellar Testnet</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-long animate-pulse"></span>
                  <span className="font-bold text-long">Connected</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-ink-muted">
                <span>Validation Speed</span>
                <span className="font-bold text-ink">~5.2s</span>
              </div>
              <div className="w-full bg-elevated h-1.5 rounded-full overflow-hidden">
                <div className="bg-long h-full w-[94%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Secure visual card */}
          <div className="relative h-48 rounded-xl overflow-hidden border border-hairline bg-surface">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 filter grayscale"
                 style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAH6ktHQ1PeV8wdE7sJ9xUB6iWF6Y4OwqBec2oid6NQl7Unh6vAK8kQBMvEuctSx_aynPrZR8O7G3e32Py-Uv3bipC_l0o77YAzlBJCiZ4kMNoVKUA8Spc2jX3-JzCZQmeMlDTNj_3Qbm7lm6lQa_Rkvxk6Znf2rm-StVpunMpIueLoOFerGJv4TlwYRMPv2EG1NA26sAYNIJ934FKmrCBGfOpTYV3MiRV89sLMrOCrkltDZzrut3o8Vmw_bnllayLh7UelBb8a-II')` }} />
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-canvas to-transparent flex items-end p-5 z-10">
              <div>
                <p className="text-2xs font-mono font-bold text-ink-faint uppercase tracking-widest">Security Protocol</p>
                <p className="text-sm font-semibold mt-1 font-mono uppercase tracking-widest text-ink">Hardware Encrypted Ledger</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
