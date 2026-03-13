"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { USDC_BASE_ADDRESS, TIP_RECEIVER, erc20Abi } from "../integrations/tipjar";

interface TipjarProps {
  onBack: () => void;
}

export default function Tipjar({ onBack }: TipjarProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("1"); // Default 1 USDC
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle success cast
  if (isConfirmed && !success && !loading) {
    setLoading(true);
    fetch("/api/tip-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: address,
        amount: amount,
        txHash: hash,
      }),
    }).then(() => {
      setSuccess(true);
      setLoading(false);
    });
  }

  const handleTip = () => {
    if (!amount || isNaN(Number(amount))) return;
    writeContract({
      address: USDC_BASE_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [TIP_RECEIVER, parseUnits(amount, 6)],
    });
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh]" style={{ background: "#09090B" }}>
      <header className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60 shrink-0">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg bg-green-500/20 text-green-400">
          💸
        </div>
        <h1 className="font-bold text-sm text-white">Cat Tipjar</h1>
      </header>

      <main className="flex-1 p-5 flex flex-col items-center justify-center">
        <div className="card p-6 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">😻</div>
          <h2 className="text-lg font-bold text-white mb-2">Feed the Cat</h2>
          <p className="text-[12px] text-zinc-400 mb-6">Support development with USDC on Base. A thank-you cast will be automatically published!</p>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
              <p className="text-green-400 font-bold mb-1">Meow! Thanks for the tip! 🐱💖</p>
              <p className="text-[10px] text-zinc-500">Auto-cast posted to Farcaster.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-white outline-none"
                  placeholder="Amount in USDC"
                />
                <div className="flex items-center px-4 bg-zinc-800/50 text-zinc-400 text-sm font-bold border-l border-zinc-800">
                  USDC
                </div>
              </div>

              <button
                onClick={handleTip}
                disabled={isConfirming || !address}
                className="w-full btn-primary py-3.5 text-sm font-bold disabled:opacity-50"
              >
                {isConfirming ? "Confirming..." : `Tip ${amount || 0} USDC`}
              </button>
              
              {!address && <p className="text-[10px] text-red-400">Connect wallet first!</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
