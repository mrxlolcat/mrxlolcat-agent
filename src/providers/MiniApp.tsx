"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";

interface MiniAppProps {
  children: React.ReactNode;
}

export default function MiniApp({ children }: MiniAppProps) {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  useEffect(() => {
    const initSdk = async () => {
      try {
        await sdk.actions.ready();
        setIsSdkLoaded(true);
      } catch (err) {
        console.error("Farcaster Mini App SDK initialization failed:", err);
        // Fallback for non-Farcaster environment testing
        setIsSdkLoaded(true);
      }
    };

    initSdk();
  }, []);

  if (!isSdkLoaded) {
    return <div className="flex items-center justify-center h-screen bg-[#0A0910] text-zinc-500">Loading Farcaster Context...</div>;
  }

  return <>{children}</>;
}
