"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

const features = [
  {
    icon: "M",
    title: "AI Agent",
    desc: "Chat with mrxlolcat powered by Qwen LLM. Get real-time market insights, swap guidance, and on-chain analysis.",
    color: "#7f77dd",
  },
  {
    icon: "S",
    title: "Token Swap",
    desc: "Real-time routing via LI.FI aggregator across 7+ chains. Best price, lowest gas, instant execution.",
    color: "#0052FF",
  },
  {
    icon: "$",
    title: "Live Markets",
    desc: "Real-time crypto prices from CoinGecko with 24h change, market cap, and auto-refresh every 30 seconds.",
    color: "#1d9e75",
  },
  {
    icon: "D",
    title: "Deploy Token",
    desc: "Launch your own ERC-20 token on any supported chain. Standard, Meme, or Governance templates.",
    color: "#f59e0b",
  },
  {
    icon: "L",
    title: "Lending",
    desc: "View lending positions, APR rates, health factor monitoring, and real-time portfolio value.",
    color: "#ef4444",
  },
  {
    icon: "⛓",
    title: "Multi-Chain",
    desc: "Base, Ethereum, Arbitrum, Optimism, Polygon, BSC, Avalanche — all chains, one interface.",
    color: "#28A0F0",
  },
];

const chains = [
  { name: "Base", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png", color: "#0052FF" },
  { name: "Ethereum", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png", color: "#627EEA" },
  { name: "Arbitrum", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png", color: "#28A0F0" },
  { name: "Optimism", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png", color: "#FF0420" },
  { name: "Polygon", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png", color: "#8247E5" },
  { name: "BSC", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png", color: "#F0B90B" },
  { name: "Avalanche", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png", color: "#E84142" },
];

export default function LandingPage() {
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-lg landing-logo-pulse">
              <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
            </div>
            <span className="text-lg font-bold">mrxlolcat</span>
          </div>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)]">
                  <span className="status-dot bg-[var(--teal)]" />
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Link href="/app" className="btn-primary px-6 py-2.5 text-sm font-semibold">
                  Launch App →
                </Link>
              </>
            ) : (
              <button onClick={() => open()} className="btn-connect px-6 py-2.5 text-sm font-semibold">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[120px] landing-float" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#0052FF] opacity-[0.08] blur-[100px] landing-float-delayed" />

        <div className="relative z-10 flex flex-col items-center gap-8 text-center landing-hero-in">
          {/* Logo */}
          <div className="relative h-28 w-28 overflow-hidden rounded-3xl shadow-2xl landing-logo-glow">
            <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" priority />
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] px-4 py-2 text-xs text-[var(--text-muted)] landing-badge-in">
            <span className="status-dot bg-[var(--teal)]" />
            Built on Base • Powered by DashScope Qwen
          </div>

          {/* Title */}
          <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your Personal
            <span className="bg-gradient-to-r from-[var(--accent)] via-[#0052FF] to-[var(--teal)] bg-clip-text text-transparent"> AI Agent </span>
            for Web3
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg text-[var(--text-muted)] sm:text-xl">
            Swap tokens, track markets, deploy contracts, and chat with an AI that understands the blockchain — all in one professional interface.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {isConnected ? (
              <Link href="/app" className="btn-primary px-10 py-4 text-lg font-semibold landing-cta-glow">
                Launch App →
              </Link>
            ) : (
              <button onClick={() => open()} className="btn-connect px-10 py-4 text-lg font-semibold landing-cta-glow">
                Connect Wallet to Start
              </button>
            )}
            <Link href="/app" className="btn-secondary px-8 py-4 text-lg font-medium">
              Explore Without Wallet
            </Link>
          </div>

          {/* Chain logos */}
          <div className="mt-4 flex items-center gap-6 landing-chains-in">
            {chains.map((chain, i) => (
              <div
                key={chain.name}
                className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <Image src={chain.logo} alt={chain.name} fill className="object-cover" unoptimized />
                </div>
                <span className="text-[10px] font-medium text-[var(--text-hint)] transition-colors duration-200 group-hover:text-[var(--text)]">
                  {chain.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need, one agent</h2>
            <p className="mt-4 text-lg text-[var(--text-muted)]">Professional tools for serious builders.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 transition-all duration-300 hover:border-[var(--border-strong)] hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to build?</h2>
          <p className="mt-4 text-lg text-[var(--text-muted)]">Connect your wallet and start using the most powerful AI agent on Base.</p>
          <div className="mt-8 flex justify-center gap-4">
            {isConnected ? (
              <Link href="/app" className="btn-primary px-10 py-4 text-lg font-semibold">
                Launch App →
              </Link>
            ) : (
              <button onClick={() => open()} className="btn-connect px-10 py-4 text-lg font-semibold">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-[var(--text-hint)]">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-lg">
              <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
            </div>
            mrxlolcat agent v3.2.0
          </div>
          <div>Built on Base • DashScope Qwen</div>
        </div>
      </footer>
    </div>
  );
}
