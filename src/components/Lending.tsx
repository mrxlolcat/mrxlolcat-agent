"use client";

import { useState, useEffect } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { API } from "~/lib/api";

interface LendingProps { onBack: () => void; }
interface Position { protocol: string; asset: string; type: string; balance: string; apy: string; value: string; }

export default function Lending({ onBack }: LendingProps) {
  const { open } = useAppKit();
  const { address: walletAddress, isConnected } = useAppKitAccount();
  const [address, setAddress] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (walletAddress && isConnected && !address) {
      setAddress(walletAddress);
    }
  }, [walletAddress, isConnected, address]);

  // Auto-fetch when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress && positions.length === 0) fetchPositions(walletAddress);
  }, [isConnected, walletAddress]);

  const fetchPositions = async (addr?: string) => {
    const a = addr || address;
    if (!a || !/^0x[a-fA-F0-9]{40}$/.test(a)) { setError("Please enter a valid wallet address (0x…)"); return; }
    setLoading(true); setError(""); setPositions([]);
    try {
      const res = await fetch(`/api/swap?mode=lending&address=${a}&network=base`);
      const data = await res.json();
      if (data.positions?.length > 0) setPositions(data.positions);
      else {
        setPositions([
          { protocol: "Aave V3", asset: "USDC", type: "Supply", balance: "0.00", apy: "4.12%", value: "$0.00" },
          { protocol: "Compound V3", asset: "ETH", type: "Supply", balance: "0.00", apy: "2.87%", value: "$0.00" },
          { protocol: "Morpho", asset: "WETH", type: "Supply", balance: "0.00", apy: "3.45%", value: "$0.00" },
        ]);
      }
    } catch { setError("Failed to fetch positions"); }
    finally { setLoading(false); }
  };

  // Wallet gate
  if (!isConnected) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
        <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
          <h1 className="font-semibold text-sm flex-1">🏦 Lending</h1>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6" style={{ background: "rgba(251, 191, 36, 0.1)" }}>🏦</div>
          <h2 className="font-bold text-xl mb-2">DeFi Lending</h2>
          <p className="text-sm text-zinc-400 mb-2 max-w-[260px]">Track your lending positions and APR across DeFi protocols on Base.</p>
          <p className="text-[10px] text-zinc-600 mb-6">Aave · Compound · Morpho</p>
          <button onClick={() => open()} className="btn-primary px-8 py-3 text-sm">Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
      <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">🏦 Lending</h1>
          <p className="text-[10px] text-zinc-500">DeFi positions on Base</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium"
          style={{ background: "rgba(34,197,94,0.08)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.15)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {walletAddress?.slice(0, 4)}…{walletAddress?.slice(-3)}
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Address */}
        <div className="flex gap-2">
          <input value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Wallet address 0x…"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder-zinc-600" />
          <button onClick={() => fetchPositions()} disabled={loading}
            className="btn-primary px-4 py-2.5 text-xs disabled:opacity-30">
            {loading ? "…" : "Fetch"}
          </button>
        </div>

        {error && <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-xs text-red-400 text-center">{error}</div>}

        {/* Positions */}
        {positions.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Positions</span>
            {positions.map((p, i) => (
              <div key={i} className="card p-3.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold">{p.asset}</span>
                    <span className="chip chip-inactive text-[9px] py-0">{p.type}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">{p.protocol}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">{p.value}</p>
                  <p className="text-[10px] text-green-400 font-medium">{p.apy} APY</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="card p-4">
          <h3 className="font-semibold text-xs mb-3 gradient-text">Popular Yields on Base</h3>
          {[
            { proto: "Aave V3", asset: "USDC", apy: "4.12%" },
            { proto: "Compound V3", asset: "ETH", apy: "2.87%" },
            { proto: "Morpho", asset: "WETH", apy: "3.45%" },
            { proto: "Moonwell", asset: "USDbC", apy: "5.23%" },
          ].map(y => (
            <div key={y.proto + y.asset} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
              <div>
                <span className="text-xs font-medium">{y.asset}</span>
                <span className="text-[10px] text-zinc-500 ml-1.5">{y.proto}</span>
              </div>
              <span className="text-xs font-bold text-green-400">{y.apy}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
