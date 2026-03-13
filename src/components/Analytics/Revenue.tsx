"use client";

import { useEffect, useState } from "react";

export default function RevenueDashboard() {
  const [revenue, setRevenue] = useState<string>("0.00");
  const feeWallet = "0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5";

  // Dummy effect to simulate fetching total accumulated fees
  useEffect(() => {
    // In a real app, you would query an RPC or an API to get the total ERC20 token balances for this wallet.
    setRevenue("14.50"); // Example dynamic value
  }, []);

  return (
    <div className="card p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl mb-4 col-span-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-zinc-400 text-sm mb-1 uppercase tracking-wider font-semibold">Total Platform Fees Collected</div>
          <div className="text-3xl font-bold text-emerald-400">${revenue}</div>
          <div className="text-[10px] text-zinc-500 mt-2">
            Fee Wallet:{" "}
            <a 
              href={`https://basescan.org/address/${feeWallet}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
            >
              {feeWallet}
            </a>
          </div>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center text-xs text-emerald-400 w-full md:w-auto">
          Generated via <strong className="text-emerald-300">LI.FI Widget</strong> & Swaps
        </div>
      </div>
    </div>
  );
}
