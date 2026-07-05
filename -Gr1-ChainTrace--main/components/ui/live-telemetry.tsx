"use client";

import { useEffect, useState } from "react";

type EventItem = {
  id: string;
  time: string;
  type: string;
  status: "SUCCESS" | "PENDING" | "PROCESSING";
  value: string;
};

const INITIAL_EVENTS: EventItem[] = [
  { id: "TX-492", time: "14:32:01", type: "ESCROW_LOCK", status: "SUCCESS", value: "45,000 USDC" },
  { id: "TX-493", time: "14:32:15", type: "ANCHOR_DEP", status: "SUCCESS", value: "220,000 MXN" },
  { id: "TX-494", time: "14:33:45", type: "CUSTOMS_SIG", status: "SUCCESS", value: "PORT_HAMBURG" },
  { id: "TX-495", time: "14:35:10", type: "INSPECT_CLR", status: "PROCESSING", value: "98% VERIFIED" },
  { id: "TX-496", time: "14:35:30", type: "ESCROW_REL", status: "PENDING", value: "45,000 USDC" },
];

export default function LiveTelemetry() {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [activeTab, setActiveTab] = useState<"LIVE" | "METRICS">("LIVE");

  useEffect(() => {
    const timer = setInterval(() => {
      setEvents((prev) => {
        // Find first processing/pending item and advance its status, or trigger a new log
        const next = [...prev];
        const processingIdx = next.findIndex((e) => e.status === "PROCESSING");
        if (processingIdx !== -1) {
          next[processingIdx].status = "SUCCESS";
          const nextPendingIdx = next.findIndex((e) => e.status === "PENDING");
          if (nextPendingIdx !== -1) {
            next[nextPendingIdx].status = "PROCESSING";
          }
        } else {
          // If all are success, reset status of last two to simulate looping
          next[3].status = "PROCESSING";
          next[4].status = "PENDING";
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full border border-white/20 bg-black font-mono text-xs text-white p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.02)]">
      {/* Helix aesthetic corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40"></div>

      {/* Panel Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-widest text-[10px] uppercase text-white/80">SOROBAN ORACLE TELEMETRY</span>
        </div>
        
        {/* Helix-like mini tabs */}
        <div className="inline-flex p-0.5 bg-neutral-900 border border-white/10">
          <button 
            onClick={() => setActiveTab("LIVE")}
            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider transition-colors ${activeTab === "LIVE" ? "bg-white text-black font-bold" : "text-white/40 hover:text-white"}`}
          >
            Live Logs
          </button>
          <button 
            onClick={() => setActiveTab("METRICS")}
            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider transition-colors ${activeTab === "METRICS" ? "bg-white text-black font-bold" : "text-white/40 hover:text-white"}`}
          >
            Network
          </button>
        </div>
      </div>

      {activeTab === "LIVE" ? (
        <div className="space-y-3">
          {/* Header Row */}
          <div className="grid grid-cols-[60px_1fr_90px_70px] text-white/40 text-[9px] border-b border-white/5 pb-1 uppercase tracking-widest">
            <span>Time</span>
            <span>Process</span>
            <span>Asset/Port</span>
            <span className="text-right">Status</span>
          </div>

          {/* Dynamic Event Rows */}
          {events.map((event) => (
            <div key={event.id} className="grid grid-cols-[60px_1fr_90px_70px] items-center hover:bg-white/5 py-1 px-1 transition-colors">
              <span className="text-white/40">{event.time}</span>
              <span className="text-white font-bold">{event.type}</span>
              <span className="text-white/60 text-[10px]">{event.value}</span>
              <span className="text-right">
                <span className={`inline-block px-1.5 py-0.5 text-[8px] border ${
                  event.status === "SUCCESS" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
                  event.status === "PROCESSING" ? "border-amber-500/30 text-amber-400 bg-amber-500/5 animate-pulse" :
                  "border-white/20 text-white/40"
                }`}>
                  {event.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {/* Mock Network Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-white/10 p-3 bg-neutral-950/50">
              <span className="text-[9px] text-white/40 uppercase block mb-1">Soroban RPC Ping</span>
              <span className="text-lg font-bold text-emerald-400">12ms</span>
            </div>
            <div className="border border-white/10 p-3 bg-neutral-950/50">
              <span className="text-[9px] text-white/40 uppercase block mb-1">Contract Gas Fee</span>
              <span className="text-lg font-bold text-white">0.0012 XLM</span>
            </div>
            <div className="border border-white/10 p-3 bg-neutral-950/50">
              <span className="text-[9px] text-white/40 uppercase block mb-1">SEP-31 Anchor API</span>
              <span className="text-lg font-bold text-emerald-400">ONLINE</span>
            </div>
            <div className="border border-white/10 p-3 bg-neutral-950/50">
              <span className="text-[9px] text-white/40 uppercase block mb-1">Active Escrows</span>
              <span className="text-lg font-bold text-white">1,492 / SEC</span>
            </div>
          </div>

          <div className="text-[9px] text-white/30 text-center uppercase tracking-widest pt-2">
            Stellar Testnet Node Ledger Version: v21.2.0
          </div>
        </div>
      )}
    </div>
  );
}
