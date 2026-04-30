"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { CHAIN_META, CHAINS } from "@/configs/constants";

const deployChains = [CHAINS.BASE, CHAINS.ETHEREUM, CHAINS.ARBITRUM, CHAINS.OPTIMISM, CHAINS.POLYGON, CHAINS.BSC, CHAINS.AVALANCHE];

const templates = [
  {
    name: "Standard ERC-20",
    desc: "Basic fungible token with mint & burn",
    features: ["Mintable", "Burnable", "Pausable"],
    icon: "🪙",
  },
  {
    name: "Meme Token",
    desc: "Community token with max supply & tax",
    features: ["Max Supply", "Anti-Whale", "Auto LP"],
    icon: "🐸",
  },
  {
    name: "Governance Token",
    desc: "DAO voting token with delegation",
    features: ["Votes", "Delegation", "Timelock"],
    icon: "🏛",
  },
];

export default function DeployPanel() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("1000000");
  const [selectedChain, setSelectedChain] = useState<number>(CHAINS.BASE);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [deploying, setDeploying] = useState(false);
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  const handleDeploy = () => {
    if (!isConnected) {
      open();
      return;
    }
    setDeploying(true);
    setTimeout(() => setDeploying(false), 3000);
  };

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Deploy Token</div>
          <h2 className="mt-2 text-2xl font-semibold">Launch Your Token</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Deploy ERC-20 tokens on any supported chain. No code required.</p>
        </div>
        <div className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
          {CHAIN_META[selectedChain]?.name || "Base"}
        </div>
      </div>

      {/* Template selection */}
      <div className="grid gap-3 md:grid-cols-3">
        {templates.map((tmpl, i) => (
          <button
            key={tmpl.name}
            type="button"
            onClick={() => setSelectedTemplate(i)}
            className={`price-card cursor-pointer text-left ${
              selectedTemplate === i ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]" : ""
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tmpl.icon}</span>
              <div>
                <div className="font-semibold text-[var(--text)]">{tmpl.name}</div>
                <div className="mt-0.5 text-xs text-[var(--text-hint)]">{tmpl.desc}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tmpl.features.map((f) => (
                <span key={f} className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-hint)]">
                  {f}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Chain selector */}
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Deploy Chain</label>
        <div className="flex flex-wrap gap-1.5">
          {deployChains.map((chainId) => {
            const chain = CHAIN_META[chainId];
            if (!chain) return null;
            return (
              <button
                key={chainId}
                type="button"
                onClick={() => setSelectedChain(chainId)}
                className={`chain-badge cursor-pointer ${selectedChain === chainId ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--bg-card))]" : ""}`}
              >
                <Image src={chain.logoUrl} alt={chain.name} width={14} height={14} className="rounded-full" unoptimized />
                <span>{chain.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Token form */}
      <div className="swap-card">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Token Name</label>
            <input
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="input-field"
              placeholder="e.g. mrxlolcat Token"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Symbol</label>
            <input
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
              className="input-field mono"
              placeholder="e.g. MRXL"
              maxLength={10}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Total Supply</label>
            <input
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              className="input-field mono"
              inputMode="numeric"
              placeholder="1000000"
            />
          </div>
        </div>

        {/* Preview */}
        {tokenName && tokenSymbol && (
          <div className="mt-4 animate-fade-in rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Preview</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] text-sm font-bold text-white">
                {tokenSymbol.slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-[var(--text)]">{tokenName}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  ${tokenSymbol} · {Number(totalSupply).toLocaleString()} supply · {CHAIN_META[selectedChain]?.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deploy button */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-[var(--text-hint)]">
            Est. gas: ~0.003 ETH on {CHAIN_META[selectedChain]?.name}
          </div>
          <button
            type="button"
            onClick={handleDeploy}
            disabled={deploying || !tokenName || !tokenSymbol}
            className="btn-primary px-6 py-2.5"
          >
            {deploying ? (
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Deploying...
              </span>
            ) : !isConnected ? (
              "Connect Wallet to Deploy"
            ) : (
              "Deploy Token"
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-[22px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-4 text-sm text-[var(--text-muted)]">
        <div className="flex items-start gap-3">
          <span className="text-lg">ℹ</span>
          <div>
            <div className="font-medium text-[var(--text)]">How it works</div>
            <p className="mt-1 text-xs leading-relaxed">
              Your token will be deployed as a verified smart contract on {CHAIN_META[selectedChain]?.name}.
              You will be the owner and can manage minting, burning, and pausing.
              The contract source code is automatically verified on the block explorer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
