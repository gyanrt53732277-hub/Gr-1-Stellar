import { ArrowRight, ShieldCheck, Ship, FileCheck, CheckCircle2, Navigation } from "lucide-react";

/**
 * Redesigned, highly premium decorative preview representing the trade terminal.
 * Vertical timeline layout, glassmorphic textures, custom status rings, and details.
 */
export function HeroPreview() {
  return (
    <div className="w-full max-w-md animate-float">
      <div className="relative rounded-2xl border border-hairline bg-surface/90 p-5 shadow-elevated backdrop-blur-md overflow-hidden">
        {/* Glow light effect behind */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-brand/10 blur-2xl rounded-full pointer-events-none" />

        {/* top row: identifier & status */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xs uppercase tracking-widest text-ink-faint">Smart Escrow</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-long opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-long"></span>
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-ink mt-0.5 tracking-tight">CT-88291</h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-brand/20 bg-brand/10 px-2.5 py-1 text-2xs text-brand font-mono uppercase tracking-wider">
            <Navigation className="h-3 w-3 animate-pulse" />
            <span>SIN → HAM</span>
          </div>
        </div>

        {/* value & asset block */}
        <div className="my-5 flex items-baseline justify-between">
          <div>
            <span className="text-3xs uppercase tracking-widest text-ink-faint font-mono">Secured Value</span>
            <div className="text-3xl font-bold text-ink font-display tracking-tight mt-0.5">
              $45,000 <span className="text-xs font-mono font-normal text-ink-muted">USDC</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xs uppercase tracking-widest text-ink-faint font-mono">Interest Accrued</span>
            <div className="text-sm font-semibold text-long font-mono tracking-wide mt-1">
              +4.85% APY
            </div>
          </div>
        </div>

        {/* vertical milestone timeline */}
        <div className="space-y-4 my-6 pl-1 relative">
          {/* vertical connection line */}
          <div className="absolute left-4.5 top-2.5 bottom-2.5 w-0.5 bg-hairline" />

          {/* Step 1: Locked */}
          <div className="flex gap-4 relative items-start">
            <div className="z-10 flex items-center justify-center h-9 w-9 rounded-full bg-long/20 border border-long text-long bg-surface">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink">Escrow Budget Locked</span>
                <span className="text-3xs font-mono text-long uppercase tracking-wide">Ledger Verified</span>
              </div>
              <p className="text-2xs text-ink-faint font-mono mt-0.5">45,000 USDC deposited in Soroban Vault</p>
            </div>
          </div>

          {/* Step 2: Shipped */}
          <div className="flex gap-4 relative items-start">
            <div className="z-10 flex items-center justify-center h-9 w-9 rounded-full bg-long/20 border border-long text-long bg-surface">
              <Ship className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink">Cargo Dispatched</span>
                <span className="text-3xs font-mono text-long uppercase tracking-wide">Ever Given II</span>
              </div>
              <p className="text-2xs text-ink-faint font-mono mt-0.5">Bill of Lading signature hashed on-chain</p>
            </div>
          </div>

          {/* Step 3: Customs */}
          <div className="flex gap-4 relative items-start">
            <div className="z-10 flex items-center justify-center h-9 w-9 rounded-full bg-brand/20 border border-brand text-brand bg-surface ring-4 ring-brand/10">
              <FileCheck className="h-4.5 w-4.5 animate-pulse-soft" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink">Customs Clearance</span>
                <span className="text-3xs font-mono text-brand uppercase tracking-wider font-bold">In Progress (68%)</span>
              </div>
              <div className="mt-1.5 h-1 w-full bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full w-[68%] transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Step 4: Release */}
          <div className="flex gap-4 relative items-start">
            <div className="z-10 flex items-center justify-center h-9 w-9 rounded-full bg-elevated border border-hairline text-ink-faint bg-surface">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 pt-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink-faint">Smart Escrow Release</span>
                <span className="text-3xs font-mono text-ink-faint uppercase tracking-wide">Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action button row */}
        <div className="mt-5 pt-4 border-t border-hairline grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-hairline bg-surface hover:bg-elevated/40 transition-colors py-2 text-center text-2xs font-bold uppercase tracking-wider text-ink-muted cursor-pointer">
            View Details
          </div>
          <div className="rounded-lg bg-paper hover:bg-paper/90 transition-colors py-2 text-center text-2xs font-bold uppercase tracking-wider text-canvas cursor-pointer shadow-soft">
            Track Cargo
          </div>
        </div>
      </div>
    </div>
  );
}
