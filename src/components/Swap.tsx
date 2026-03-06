"use client";

import { useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { API, FEE_WALLET } from "~/lib/api";

interface SwapProps { onBack: () => void; }

const CHAINS = [
  { id: "ethereum", name: "Ethereum", short: "ETH", icon: "⟠" },
  { id: "base", name: "Base", short: "Base", icon: "🔵" },
  { id: "arbitrum", name: "Arbitrum", short: "ARB", icon: "🔷" },
  { id: "polygon", name: "Polygon", short: "POL", icon: "🟣" },
  { id: "optimism", name: "Optimism", short: "OP", icon: "🔴" },
  { id: "bsc", name: "BNB Chain", short: "BSC", icon: "🟡" },
  { id: "avalanche", name: "Avalanche", short: "AVAX", icon: "🔺" },
  { id: "zksync", name: "zkSync", short: "ZK", icon: "🔹" },
  { id: "linea", name: "Linea", short: "LIN", icon: "🔘" },
  { id: "scroll", name: "Scroll", short: "SCR", icon: "📜" },
  { id: "blast", name: "Blast", short: "BLAST", icon: "💥" },
  { id: "mantle", name: "Mantle", short: "MNT", icon: "🌀" },
];

const TOKENS: Record<string, Array<{ symbol: string; address: string; decimals: number }>> = {
  ethereum: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
    { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
    { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
    { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
  ],
  base: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
    { symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 },
    { symbol: "cbETH", address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", decimals: 18 },
    { symbol: "DAI", address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18 },
  ],
  arbitrum: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
    { symbol: "ARB", address: "0x912CE59144191C1204E64559FE8253a0e49E6548", decimals: 18 },
    { symbol: "WETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", decimals: 18 },
    { symbol: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6 },
    { symbol: "GMX", address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a", decimals: 18 },
  ],
  polygon: [
    { symbol: "POL", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6 },
    { symbol: "WETH", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
    { symbol: "WMATIC", address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", decimals: 18 },
    { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
  ],
  optimism: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", decimals: 6 },
    { symbol: "OP", address: "0x4200000000000000000000000000000000000042", decimals: 18 },
    { symbol: "WETH", address: "0x4200000000000000000000000000000000000006", decimals: 18 },
  ],
  bsc: [
    { symbol: "BNB", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
    { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
    { symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 },
    { symbol: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", decimals: 18 },
  ],
  avalanche: [
    { symbol: "AVAX", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", decimals: 6 },
    { symbol: "WAVAX", address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", decimals: 18 },
  ],
  zksync: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4", decimals: 6 },
  ],
  linea: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff", decimals: 6 },
  ],
  scroll: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4", decimals: 6 },
  ],
  blast: [
    { symbol: "ETH", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDB", address: "0x4300000000000000000000000000000000000003", decimals: 18 },
  ],
  mantle: [
    { symbol: "MNT", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: 18 },
    { symbol: "USDC", address: "0x09Bc4E0D10E52d8DA2B6462EC1e3a2B7b5aB56cC", decimals: 6 },
  ],
};

interface Quote { aggregator: string; buyAmount: string; priceImpact: string; isBest: boolean; }

export default function Swap({ onBack }: SwapProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [chain, setChain] = useState("base");
  const [showChains, setShowChains] = useState(false);
  const [sellIdx, setSellIdx] = useState(0);
  const [buyIdx, setBuyIdx] = useState(1);
  const [sellAmt, setSellAmt] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tokens = TOKENS[chain] || TOKENS.base;
  const chainInfo = CHAINS.find(c => c.id === chain)!;

  const getQuote = async () => {
    if (!isConnected) { open(); return; }
    if (!sellAmt || parseFloat(sellAmt) <= 0) { setError("Enter an amount"); return; }
    setLoading(true); setError(""); setQuotes([]);
    try {
      const sell = tokens[sellIdx], buy = tokens[buyIdx];
      const raw = (parseFloat(sellAmt) * 10 ** sell.decimals).toFixed(0);
      const p = new URLSearchParams({
        network: chain, sellToken: sell.address, buyToken: buy.address, sellAmount: raw, slippage,
        user: address || "0x0000000000000000000000000000000000000000",
        eoaAddress: address || "0x0000000000000000000000000000000000000000",
        accountType: "eoa",
      });
      const res = await fetch(`/api/swap?${p}`);
      const data = await res.json();
      if (data.aggregators?.length > 0) {
        setQuotes(data.aggregators.filter((a: any) => !a.error).map((a: any, i: number) => ({
          aggregator: a.displayName || a.name,
          buyAmount: (parseFloat(a.data.buyTokenAmount) / 10 ** buy.decimals).toFixed(6),
          priceImpact: a.data.priceImpact || "—",
          isBest: i === 0,
        })));
      } else { setError("No routes found for this pair"); }
    } catch { setError("Failed to fetch quotes"); }
    finally { setLoading(false); }
  };

  // Wallet gate
  if (!isConnected) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
        <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
          <h1 className="font-semibold text-sm flex-1">🔄 Swap</h1>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6" style={{ background: "rgba(99, 102, 241, 0.1)" }}>🔗</div>
          <h2 className="font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-sm text-zinc-400 mb-6 max-w-[260px]">Connect your wallet to swap tokens across 12+ chains with the best prices.</p>
          <button onClick={() => open()} className="btn-primary px-8 py-3 text-sm">Connect Wallet</button>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {CHAINS.slice(0, 6).map(c => (
              <span key={c.id} className="chip chip-inactive text-[10px]">{c.icon} {c.short}</span>
            ))}
            <span className="chip chip-inactive text-[10px]">+{CHAINS.length - 6} more</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
      {/* Header */}
      <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">🔄 Swap</h1>
          <p className="text-[10px] text-zinc-500">7 aggregators · {chainInfo.name}</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium"
          style={{ background: "rgba(34,197,94,0.08)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.15)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {address?.slice(0, 4)}…{address?.slice(-3)}
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Chain selector */}
        <div>
          <button onClick={() => setShowChains(!showChains)} className="flex items-center gap-2 chip chip-active text-xs">
            {chainInfo.icon} {chainInfo.name}
            <svg className={`w-3 h-3 transition ${showChains ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showChains && (
            <div className="grid grid-cols-3 gap-1.5 mt-2 animate-fade-in">
              {CHAINS.map(c => (
                <button key={c.id} onClick={() => { setChain(c.id); setSellIdx(0); setBuyIdx(1); setQuotes([]); setShowChains(false); }}
                  className={`chip text-[10px] justify-center ${chain === c.id ? "chip-active" : "chip-inactive"}`}>
                  {c.icon} {c.short}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sell */}
        <div className="gradient-border rounded-2xl bg-zinc-900/60 p-4">
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">You pay</span>
          <div className="flex gap-3 items-center mt-2">
            <input type="number" value={sellAmt} onChange={e => { setSellAmt(e.target.value); setQuotes([]); }}
              placeholder="0.0" className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder-zinc-700 min-w-0" />
            <select value={sellIdx} onChange={e => { setSellIdx(+e.target.value); setQuotes([]); }}
              className="bg-zinc-800 text-white px-3 py-2 rounded-xl text-xs border border-zinc-700 font-medium cursor-pointer">
              {tokens.map((t, i) => <option key={i} value={i}>{t.symbol}</option>)}
            </select>
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center -my-1 relative z-10">
          <button onClick={() => { const t = sellIdx; setSellIdx(buyIdx); setBuyIdx(t); setQuotes([]); }}
            className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-400 hover:bg-indigo-600/15 transition active:scale-90 text-sm">↕</button>
        </div>

        {/* Buy */}
        <div className="gradient-border rounded-2xl bg-zinc-900/60 p-4">
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">You receive</span>
          <div className="flex gap-3 items-center mt-2">
            <div className="flex-1 text-2xl font-bold">{quotes[0]?.buyAmount || <span className="text-zinc-700">0.0</span>}</div>
            <select value={buyIdx} onChange={e => { setBuyIdx(+e.target.value); setQuotes([]); }}
              className="bg-zinc-800 text-white px-3 py-2 rounded-xl text-xs border border-zinc-700 font-medium cursor-pointer">
              {tokens.map((t, i) => <option key={i} value={i}>{t.symbol}</option>)}
            </select>
          </div>
        </div>

        {/* Slippage */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-500 mr-1">Slippage</span>
          {["0.5", "1", "2", "3"].map(s => (
            <button key={s} onClick={() => setSlippage(s)}
              className={`chip text-[10px] ${slippage === s ? "chip-active" : "chip-inactive"}`}>
              {s}%
            </button>
          ))}
        </div>

        {/* Action */}
        <button onClick={getQuote} disabled={loading || !sellAmt}
          className="w-full btn-primary py-3.5 text-sm">
          {loading ? "Finding best route…" : "Get Best Price"}
        </button>

        {error && <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-xs text-red-400 text-center">{error}</div>}

        {/* Quotes */}
        {quotes.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Routes</span>
            {quotes.map((q, i) => (
              <div key={i} className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition ${q.isBest ? "card border-indigo-500/25" : "bg-zinc-900/40 border border-zinc-800/40 rounded-xl"}`}>
                <div className="flex items-center gap-2">
                  {q.isBest && <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-medium">Best</span>}
                  <span className="text-xs font-medium">{q.aggregator}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold">{q.buyAmount}</div>
                  {q.priceImpact !== "—" && <div className="text-[9px] text-zinc-500">{q.priceImpact}%</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
