"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import Chat from "./Chat";

interface AppProps {
  onBack?: () => void;
}

export default function App({ onBack }: AppProps) {
  const [ready, setReady] = useState(false);
  const [context, setContext] = useState<any>(null);

  const init = useCallback(async () => {
    try {
      const ctx = await sdk.context;
      setContext(ctx);
      await sdk.actions.ready();
    } catch {
      console.log("[mrxlolcat-agent] standalone mode");
    }
    setReady(true);
  }, []);

  useEffect(() => { init(); }, [init]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cat-darker">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🐱</div>
          <p className="rainbow-text font-bold text-lg">loading mrxlolcat-agent...</p>
        </div>
      </div>
    );
  }

  return <Chat context={context} onBack={onBack} />;
}
