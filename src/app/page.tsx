"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

export type View = "app" | "social" | "analytics";

const App = dynamic(() => import("~/components/App"), { ssr: false });
const Social = dynamic(() => import("~/components/Social"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<View>("app");

  const features = [
    {
      title: "Autonomous Reasoning",
      detail: "Dynamic tool orchestration with GPT-4o, Claude 3.5, and Gemini via OpenRouter.",
    },
    {
      title: "On-Chain Intelligence",
      detail: "Monitor Base + Optimism wallets, bridge liquidity, and trigger actions through LI.FI.",
    },
    {
      title: "Farcaster First",
      detail: "Integrated Neynar social publishing, identity-bound sessions, and agent memory via Pinecone.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative isolate overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(14,165,233,0.35), transparent 60%)" }} />
        <section className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">MRX LOLCAT · Open-Source Agent Suite</p>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            AI automation for Base, Optimism, and the Farcaster agentic economy.
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Deploy a polished command center, orchestrate multi-chain transfers with LI.FI, and publish to Mini Apps—all from a secure, Pinecone-backed agent that you can ship to Vercel with zero custody.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="btn-primary px-6 py-3 font-semibold">Launch Agent Terminal</button>
            <button className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500">
              View Documentation
            </button>
          </div>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <div>
              <p className="text-3xl font-black text-white">24/7</p>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Autonomous Ops</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">60+</p>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Chains bridged</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">FID-backed</p>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Pinecone memory</p>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card flex flex-col gap-3 border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Feature</p>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{feature.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-1 shadow-[0_25px_80px_rgba(15,23,42,0.5)]">
          <div className="rounded-3xl bg-black p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Live Preview</p>
                <h2 className="text-2xl font-black">Command Center</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span className={`h-2 w-2 rounded-full ${view === "app" ? "bg-emerald-400" : "bg-slate-700"}`} />
                {view === "app" ? "Terminal" : "Social Feed"}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setView("app")}
                className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${view === "app" ? "border-emerald-400 text-white" : "border-slate-700 text-slate-500"}`}
              >
                Terminal
              </button>
              <button
                onClick={() => setView("social")}
                className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${view === "social" ? "border-emerald-400 text-white" : "border-slate-700 text-slate-500"}`}
              >
                Social
              </button>
            </div>

            <div className="mt-6 h-[28rem] overflow-hidden rounded-3xl border border-slate-800 bg-black/60">
              {view === "app" ? <App /> : <Social onBack={() => setView("app")} />}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Ready for public deployment</p>
          <h3 className="mt-4 text-3xl font-black">Ship to Vercel, host on Farcaster, execute anywhere.</h3>
          <p className="mt-3 text-slate-300">Everything you see is client-rendered, themeable, and wired for API routes—just fill in your `.env.local`, link your MCP, and deploy.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button className="btn-primary px-8 py-3">Deploy to Vercel</button>
            <button className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
              Download Skill Manifest
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
