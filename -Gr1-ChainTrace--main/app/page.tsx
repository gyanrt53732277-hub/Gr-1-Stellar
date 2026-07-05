"use client";

import { ArrowRight, ArrowUpRight, Shield, Activity, Shuffle, Coins, TrendingDown, KeyRound } from "lucide-react";
import Link from "next/link";
import { HeroPreview } from "@/components/brand/hero-preview";
import { Reveal } from "@/components/ui/reveal";
import { HelixButton } from "@/components/ui/helix-button";

const STATS = [
  { label: "Active Escrows", value: "1,492" },
  { label: "Connected Ports", value: "32" },
  { label: "Avg. Settlement", value: "< 24 Hours" },
  { label: "Settlement Asset", value: "USDC" },
];

// Inline features grid config is inside Bento Grid below

const PIPELINE_STEPS = [
  { id: 1, step: "01", title: "ORDER FUNDED", desc: "Buyer deposits USDC into Soroban vault escrow contract.", detail: "Tx Confirmed · Testnet" },
  { id: 2, step: "02", title: "CARGO SHIPPED", desc: "Vessel details & Bill of Lading hash logged on-chain.", detail: "Ever Given II · Singapore Port" },
  { id: 3, step: "03", title: "INSPECTION CLEAR", desc: "Port authority uploads digital validation signature.", detail: "Active · Hamburg Custom House" },
  { id: 4, step: "04", title: "PAYMENT RELEASED", desc: "Escrow funds automatically unlock and route to supplier.", detail: "Pending verification" }
];

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      {/* Hero grid background */}
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-20 md:pt-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <p className="eyebrow animate-reveal-up" style={{ animationDelay: "0ms" }}>
              Trustless Trade & Escrow Protocol · Soroban
            </p>
            <h1
              className="font-display max-w-2xl animate-reveal-up text-[3.5rem] leading-[0.93] tracking-[-0.045em] text-ink sm:text-6xl md:text-[5rem]"
              style={{ animationDelay: "80ms" }}
            >
              Supply chain financing, redefined.
            </h1>
            <p
              className="max-w-lg animate-reveal-up text-lg leading-relaxed text-ink-muted"
              style={{ animationDelay: "180ms" }}
            >
              Eliminate counterparty risk and speed up capital velocity. Lock funds in secure, milestone-based escrow contracts, and settle instantly with Stellar anchors.
            </p>
            <div className="flex animate-reveal-up flex-wrap items-center gap-3" style={{ animationDelay: "260ms" }}>
              <Link href="/dashboard">
                <HelixButton variant="primary" size="lg">
                  Launch Console <ArrowRight className="h-4 w-4" />
                </HelixButton>
              </Link>
              <Link href="/transfer">
                <HelixButton variant="secondary" size="lg">
                  Direct Transfer
                </HelixButton>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden animate-reveal-up justify-self-center lg:flex lg:justify-self-end" style={{ animationDelay: "340ms" }}>
            {/* Glow background behind hero mockup */}
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[48px] bg-brand/[0.08] blur-[90px]" />
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Live Marquee (decorative supply chain stats ticker) */}
      <div aria-hidden className="border-y border-hairline bg-surface py-3.5">
        <div className="mask-fade-r overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 pr-10">
            {Array.from({ length: 4 }).map((_, outerIdx) => (
              <div key={outerIdx} className="flex items-center gap-10">
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-ink font-mono uppercase tracking-wider">Total Volume Secured</span>
                  <span className="tnum text-sm text-brand font-bold">$12.4M USDC</span>
                  <span className="text-ink-faint">·</span>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-ink font-mono uppercase tracking-wider">Average Processing</span>
                  <span className="tnum text-sm text-emerald-400 font-bold">1.2s / Ledger</span>
                  <span className="text-ink-faint">·</span>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-ink font-mono uppercase tracking-wider">USDC Anchor liquidity</span>
                  <span className="tnum text-sm text-ink-muted font-bold">Optimal</span>
                  <span className="text-ink-faint">·</span>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-ink font-mono uppercase tracking-wider">Soroban Engine Version</span>
                  <span className="tnum text-sm text-ink-faint font-bold">Mainnet Ready</span>
                  <span className="text-ink-faint">·</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Band */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 pt-16">
          <div className="grid grid-cols-2 divide-x divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface md:grid-cols-4">
            {STATS.map((s, idx) => (
              <div key={idx} className="px-6 py-7">
                <p className="eyebrow mb-2.5">{s.label}</p>
                <p className="font-display text-3xl text-ink md:text-4xl">{s.value}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Narrative Section ("Why Stellar") */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <p className="eyebrow mb-5">Why Stellar</p>
            <h2 className="font-display text-4xl leading-[1.05] text-ink md:text-5xl">
              An interoperable network built for real-world fiat anchors.
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-6 md:col-span-7 md:pt-2">
            <p className="text-lg leading-relaxed text-ink-muted">
              Ethereum L2s and other chains lack native, standardized fiat integration. Stellar&apos;s anchors (via SEP-24 and SEP-31 standards) act as native ramps, allowing a buyer in the USA to fund in USD and a supplier in Mexico to off-ramp directly in MXN.
            </p>
            <p className="text-base leading-relaxed text-ink-faint">
              Soroban smart contracts bind this entire flow together with sub-cent transactions. SMEs can trigger micro-milestone escrows dynamically, completely avoiding expensive traditional banking rails like letters of credit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pipeline Section (Milestones modeled after Helix markets table) */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <p className="eyebrow mb-8">Active Trade Pipeline Console</p>
          <div className="border-t border-hairline">
            {PIPELINE_STEPS.map((step) => (
              <div
                key={step.id}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-5 border-b border-hairline px-1 py-6 md:grid-cols-[3rem_1fr_1fr_auto] md:gap-8 hover:bg-surface/30 transition-colors"
              >
                <span className="tnum text-lg text-brand/70 font-mono">{step.step}</span>
                <div>
                  <div className="font-display text-xl text-ink md:text-2xl">{step.title}</div>
                  <div className="mt-0.5 text-xs text-ink-faint font-mono">
                    {step.desc}
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <div className="text-sm text-ink font-mono">{step.detail}</div>
                  <div className="text-[10px] text-ink-faint uppercase font-mono mt-0.5">Status Checked</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Protocol Features Section (Asymmetric Bento Grid) */}
      <section className="border-t border-hairline bg-surface/20">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 space-y-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">Core Capabilities</p>
            <h2 className="font-display text-4xl leading-[1.05] text-ink md:text-5xl">
              Trustless Escrow for Global Trade.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              An auditable, registry-vault design built from the ground up for trade, logic isolation, and anchor integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Hardened Soroban Escrow (Span 2) */}
            <Reveal className="md:col-span-2 border border-hairline bg-surface p-8 rounded-2xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-44 h-44 bg-brand/[0.04] blur-[40px] rounded-full pointer-events-none transition-all group-hover:bg-brand/[0.07]" />
              <div className="flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-brand/10 border border-brand/20 flex items-center justify-center rounded-lg text-brand">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-2xs text-ink-faint font-mono uppercase tracking-wider">01 // SECURITY</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-ink">Hardened Soroban Escrow</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed font-mono">
                    Multi-contract registry and vault system separating execution logic from capital custody. Each contract is fully auditable on-chain, protecting buyers and suppliers alike.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Box 2: Live Port Telemetry (Span 1) */}
            <Reveal className="border border-hairline bg-surface p-8 rounded-2xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-[30px] rounded-full pointer-events-none transition-all group-hover:bg-emerald-500/[0.06]" />
              <div className="flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-long/10 border border-long/20 flex items-center justify-center rounded-lg text-long animate-pulse-soft">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-2xs text-ink-faint font-mono uppercase tracking-wider">02 // TRACKING</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-ink">Live Port Telemetry</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed font-mono">
                    Real-time verification feeds stream customs, bill of lading, and port clearance events directly into trade smart contracts.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Box 3: SEP-24 & SEP-31 Off-Ramps (Span 1) */}
            <Reveal className="border border-hairline bg-surface p-8 rounded-2xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.03] blur-[30px] rounded-full pointer-events-none" />
              <div className="flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-brand/10 border border-brand/20 flex items-center justify-center rounded-lg text-brand">
                    <Shuffle className="h-5 w-5" />
                  </div>
                  <span className="text-2xs text-ink-faint font-mono uppercase tracking-wider">03 // FIAT ACCESS</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-ink">SEP-24 & SEP-31 Off-Ramps</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed font-mono">
                    Suppliers receive local fiat payments (MXN, BRL, EUR) directly to their bank accounts immediately upon milestone verification.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Box 4: Multi-Currency Escrows (Span 1) */}
            <Reveal className="border border-hairline bg-surface p-8 rounded-2xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.03] blur-[30px] rounded-full pointer-events-none" />
              <div className="flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-brand/10 border border-brand/20 flex items-center justify-center rounded-lg text-brand">
                    <Coins className="h-5 w-5" />
                  </div>
                  <span className="text-2xs text-ink-faint font-mono uppercase tracking-wider">04 // LIQUIDITY</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-ink">Multi-Currency Escrows</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed font-mono">
                    Lock trade capital in digital USD (USDC), Euro (EURC), or native XLM. Manage pricing variables dynamically with swappable oracle adapters.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Box 5: Predictable, Low Fees (Span 1) */}
            <Reveal className="border border-hairline bg-surface p-8 rounded-2xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-[30px] rounded-full pointer-events-none" />
              <div className="flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-long/10 border border-long/20 flex items-center justify-center rounded-lg text-long">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <span className="text-2xs text-ink-faint font-mono uppercase tracking-wider">05 // VELOCITY</span>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold text-ink">Predictable, Low Fees</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed font-mono">
                    Execute complex conditional trade logic for under a fraction of a cent, shielding SMEs from volatile gas price spikes.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Box 6: Rigorous Access Control (Span 3) */}
            <Reveal className="md:col-span-3 border border-hairline bg-surface p-8 rounded-2xl relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/[0.02] blur-[50px] rounded-full pointer-events-none transition-all group-hover:bg-red-500/[0.04]" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-short/10 border border-short/20 flex items-center justify-center rounded-lg text-short">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <span className="text-2xs text-ink-faint font-mono uppercase tracking-wider">06 // GOVERNANCE</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-ink">Rigorous Access Control &amp; Safeguards</h3>
                  <p className="max-w-2xl text-sm text-ink-muted leading-relaxed font-mono">
                    Role-based access permissions, multi-signature contract releases, and global emergency pause capability guard trade integrity under any network conditions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:self-end">
                  {["Multisig Auth", "Time-locks", "Emergency Pause", "Audited Core"].map((lbl) => (
                    <span key={lbl} className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-canvas border border-hairline rounded-md text-ink-muted">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-28">
          <p className="eyebrow mb-6">Built on Stellar Soroban</p>
          <h2 className="font-display mx-auto max-w-3xl text-balance text-5xl leading-[1.03] text-ink md:text-7xl">
            Secure your global trade in sixty seconds.
          </h2>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/dashboard">
              <HelixButton variant="primary" size="lg">
                Enter Dashboard <ArrowRight className="h-4 w-4" />
              </HelixButton>
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
