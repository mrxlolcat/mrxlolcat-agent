"use client";

import { useState, useEffect } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { API, FEE_WALLET, PLATFORM_FEE_BPS } from "~/lib/api";

interface LaunchpadProps { onBack: () => void; }
interface DeployResult { ok: boolean; token?: string; pool?: string; txHash?: string; basescan?: string; error?: string; }

export default function Launchpad({ onBack }: LaunchpadProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [step, setStep] = useState<"form" | "deposit" | "deploying" | "done">("form");
  const [form, setForm] = useState({
    name: "", symbol: "", image: "",
    tokenOwner: address || "", feeRecipient: FEE_WALLET,
    lpBps: "10000", airdropEnabled: false, airdropAddress: "", airdropAmount: "",
  });
  const [depositAddress, setDepositAddress] = useState("");
  const [depositFunded, setDepositFunded] = useState(false);
  const [checkingDeposit, setCheckingDeposit] = useState(false);
  const [result, setResult] = useState<DeployResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (address && isConnected) setForm(f => ({ ...f, tokenOwner: f.tokenOwner || address }));
  }, [address, isConnected]);

  const createDeposit = async () => {
    if (!form.name || !form.symbol || !form.tokenOwner || !form.feeRecipient) { setError("Fill all required fields"); return; }
    setError("");
    try {
      const res = await fetch(`${API.launchpad}/api/deposit`, { method: "POST", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.ok && data.depositAddress) { setDepositAddress(data.depositAddress); setStep("deposit"); }
      else setError(data.error || "Failed to create deposit");
    } catch { setError("Failed to connect to launchpad API"); }
  };

  const checkDeposit = async () => {
    setCheckingDeposit(true);
    try {
      const res = await fetch(`${API.launchpad}/api/deposit/${depositAddress}`);
      const data = await res.json();
      if (data.funded) setDepositFunded(true);
      else setError(`Balance: ${data.balance || "0"} ETH — need 0.0001 ETH on Base`);
    } catch { setError("Failed to check deposit"); }
    finally { setCheckingDeposit(false); }
  };

  const deploy = async () => {
    setStep("deploying"); setError("");
    try {
      const body: Record<string, any> = {
        depositAddress, name: form.name, symbol: form.symbol.toUpperCase(),
        image: form.image || "https://via.placeholder.com/200", tokenOwner: form.tokenOwner,
        totalSupply: 0, lpBps: parseInt(form.lpBps),
        feeRecipients: form.feeRecipient.toLowerCase() === FEE_WALLET.toLowerCase()
          ? [{ address: FEE_WALLET, bps: 10000 }]
          : [{ address: FEE_WALLET, bps: PLATFORM_FEE_BPS }, { address: form.feeRecipient, bps: 10000 - PLATFORM_FEE_BPS }],
      };
      if (form.airdropEnabled && form.airdropAddress) {
        body.airdrop = { enabled: true, recipients: [{ address: form.airdropAddress, amount: form.airdropAmount || "100000000000000000000000000" }] };
      }
      const res = await fetch(`${API.launchpad}/api/deploy`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.ok) {
        setResult(data); setStep("done");
        if (data.token && data.pool) {
          try { await fetch(`${API.launchpad}/api/deploy/${data.token}/buy`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pool: data.pool, tokenIsToken0: data.tokenIsToken0, buyAmountETH: "0.0001" }) }); } catch {}
        }
      } else { setError(data.error || "Deployment failed"); setStep("deposit"); }
    } catch { setError("Deployment failed"); setStep("deposit"); }
  };

  // Wallet gate
  if (!isConnected) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
        <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
          <h1 className="font-semibold text-sm flex-1">🚀 Launchpad</h1>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6" style={{ background: "rgba(244, 114, 182, 0.1)" }}>🚀</div>
          <h2 className="font-bold text-xl mb-2">Launch Your Token</h2>
          <p className="text-sm text-zinc-400 mb-2 max-w-[260px]">Deploy a token with DEX liquidity on Base for just 0.0001 ETH.</p>
          <p className="text-[10px] text-zinc-600 mb-6">Auto liquidity pool · Airdrop support · Atomic deploy</p>
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
          <h1 className="font-semibold text-sm">🚀 Launchpad</h1>
          <p className="text-[10px] text-zinc-500">Deploy on Base · 0.0001 ETH</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium"
          style={{ background: "rgba(34,197,94,0.08)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.15)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {address?.slice(0, 4)}…{address?.slice(-3)}
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Form */}
        {step === "form" && (
          <div className="space-y-3 animate-fade-in">
            <div className="card p-4 space-y-3">
              <h2 className="font-bold text-sm gradient-text">Token Details</h2>
              {[
                { label: "Name *", key: "name", ph: "e.g. MrxLolCat Token" },
                { label: "Symbol *", key: "symbol", ph: "e.g. MCAT", max: 10 },
                { label: "Logo URL", key: "image", ph: "https://..." },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] text-zinc-500 mb-1 block font-medium">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.ph} maxLength={f.max}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600" />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block font-medium">Owner Address *</label>
                <input value={form.tokenOwner} onChange={e => setForm({ ...form, tokenOwner: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block font-medium">Fee Recipient *</label>
                <input value={form.feeRecipient} onChange={e => setForm({ ...form, feeRecipient: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono" />
                <p className="text-[9px] text-zinc-600 mt-1">{PLATFORM_FEE_BPS / 100}% platform fee on trades</p>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 mb-1 block font-medium">Liquidity</label>
                <select value={form.lpBps} onChange={e => setForm({ ...form, lpBps: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white">
                  <option value="10000">100% LP</option>
                  <option value="9000">90% LP + 10% Airdrop</option>
                  <option value="8000">80% LP + 20% Airdrop</option>
                </select>
              </div>
              {form.lpBps !== "10000" && (
                <div className="bg-zinc-900/60 rounded-xl p-3">
                  <label className="text-[10px] text-zinc-500 mb-1 block font-medium">Airdrop Recipient</label>
                  <input value={form.airdropAddress} onChange={e => setForm({ ...form, airdropEnabled: true, airdropAddress: e.target.value })}
                    placeholder="0x…" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono" />
                </div>
              )}
            </div>
            {error && <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-xs text-red-400 text-center">{error}</div>}
            <button onClick={createDeposit} className="w-full btn-primary py-3 text-sm">Create Deposit →</button>
            <p className="text-[10px] text-zinc-600 text-center">Cost: 0.0001 ETH (~$0.27)</p>
          </div>
        )}

        {/* Deposit */}
        {step === "deposit" && (
          <div className="space-y-4 animate-fade-in">
            <div className="card p-5 text-center space-y-4">
              <div className="text-4xl">💰</div>
              <h2 className="font-bold">Fund Deposit</h2>
              <p className="text-sm text-zinc-400">Send <strong className="text-white">0.0001 ETH</strong> on <strong className="text-white">Base</strong> to:</p>
              <div className="bg-zinc-900 rounded-xl p-3 font-mono text-[11px] text-indigo-300 break-all select-all">{depositAddress}</div>
              <p className="text-[10px] text-zinc-600">Expires in 24h</p>
            </div>
            {error && <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-xs text-red-400 text-center">{error}</div>}
            {!depositFunded ? (
              <button onClick={checkDeposit} disabled={checkingDeposit}
                className="w-full card py-3 text-sm font-semibold text-center disabled:opacity-40">
                {checkingDeposit ? "Checking…" : "Check Deposit Status"}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-3 text-xs text-green-400 text-center">✅ Deposit confirmed!</div>
                <button onClick={deploy} className="w-full btn-primary py-3 text-sm">🚀 Deploy Token</button>
              </div>
            )}
          </div>
        )}

        {/* Deploying */}
        {step === "deploying" && (
          <div className="text-center py-16 space-y-4 animate-fade-in">
            <div className="text-5xl animate-bounce">🚀</div>
            <h2 className="font-bold text-lg">Deploying {form.name}…</h2>
            <p className="text-sm text-zinc-400">Token + Pool + LP atomic deploy</p>
            <div className="flex justify-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot" />
              <span className="w-2 h-2 bg-purple-400 rounded-full typing-dot" />
              <span className="w-2 h-2 bg-pink-400 rounded-full typing-dot" />
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && result && (
          <div className="space-y-4 animate-fade-in">
            <div className="card p-5 text-center space-y-4" style={{ borderColor: "rgba(34, 197, 94, 0.2)" }}>
              <div className="text-5xl">🎉</div>
              <h2 className="font-bold text-lg gradient-text">Token Deployed!</h2>
              <div className="space-y-2 text-sm text-left">
                {[
                  ["Token", result.token],
                  ["Pool", result.pool],
                  ["Tx", result.txHash],
                ].map(([l, v]) => v && (
                  <div key={l} className="flex justify-between">
                    <span className="text-zinc-400">{l}</span>
                    <span className="font-mono text-[10px] text-indigo-300">{v.slice(0, 8)}…{v.slice(-6)}</span>
                  </div>
                ))}
              </div>
            </div>
            {result.basescan && (
              <a href={result.basescan} target="_blank" rel="noopener noreferrer"
                className="block w-full card py-3 text-sm font-semibold text-center">View on BaseScan →</a>
            )}
            <button onClick={() => { setStep("form"); setResult(null); setDepositAddress(""); setDepositFunded(false); }}
              className="w-full btn-primary py-3 text-sm">Launch Another 🚀</button>
          </div>
        )}
      </div>
    </div>
  );
}
