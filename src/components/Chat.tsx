"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
// Context type from Farcaster SDK
import { loadHistory, saveHistory, clearHistory, type StoredMessage } from "~/lib/memory";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  context: any;
  onBack?: () => void;
}

function TypingDots() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-6 h-6 rounded-full border border-warden-accent/20 flex items-center justify-center text-[10px] bg-black shrink-0 mt-1">🤠</div>
      <div className="bg-zinc-900/40 rounded-xl rounded-tl-none px-4 py-3 flex gap-1.5 border border-warden-border">
        <span className="w-1.5 h-1.5 bg-warden-accent rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-warden-accent rounded-full typing-dot opacity-60" />
        <span className="w-1.5 h-1.5 bg-warden-accent rounded-full typing-dot opacity-30" />
      </div>
    </div>
  );
}

export default function Chat({ context, onBack }: ChatProps) {
  const { address } = useAccount();
  const user = context?.user?.displayName || context?.user?.username || "anon";
  const pfp = context?.user?.pfpUrl;

  // Load persistent history
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadHistory();
    if (stored.length > 0) {
      return stored.map((m) => ({ id: m.id, role: m.role, content: m.content }));
    }
    return [
      {
        id: "welcome",
        role: "assistant" as const,
        content: `system initialized. 🔋\n\nwelcome, ${user}. 🤠 how can i assist your cross-chain operations today?`,
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage whenever messages change
  useEffect(() => {
    const storable: StoredMessage[] = messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: Date.now(),
    }));
    saveHistory(storable);
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClear = () => {
    clearHistory();
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content: `memory cleared. 🧹 fresh secure state established.\n\nhow can i help, ${user}? 🤠`,
      },
    ]);
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-20).map(({ role, content }) => ({ role, content })),
          fid: context?.user?.fid,
          channel: context?.location?.url || context?.location?.id || "default",
          modelId: selectedModel,
          walletAddress: address,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/plain") || contentType.includes("text/event-stream")) {
        setStreaming(true);
        const assistantId = (Date.now() + 1).toString();
        setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
        setLoading(false);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("0:")) {
                try {
                  const text = JSON.parse(line.slice(2));
                  fullText += text;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
                  );
                } catch { /* skip malformed */ }
              }
            }
          }
        }
        setStreaming(false);
      } else {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: "assistant", content: data.content },
        ]);
        setLoading(false);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "protocol error. ⚠️ connection interrupted." },
      ]);
      setLoading(false);
      setStreaming(false);
    }
  }, [input, loading, messages, address, selectedModel, context]);

  const playTTS = async (text: string) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (e) {
      console.error("TTS error", e);
    }
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] max-h-screen bg-black">
      {/* Header */}
      <header className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-warden-border shrink-0">
        {onBack && (
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        )}
        <div className="w-9 h-9 rounded-full flex items-center justify-center border border-warden-accent/30 bg-black overflow-hidden">
          <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-[11px] uppercase tracking-widest text-white">MRX<span className="text-warden-accent">LOLCAT</span></h1>
          <p className="text-[9px] font-mono text-zinc-500 uppercase">
            {loading ? "processing…" : streaming ? "streaming…" : `active · v3.0`}
          </p>
        </div>
        
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-black border border-warden-border text-zinc-400 text-[9px] font-bold uppercase rounded-md px-2 py-1 outline-none focus:border-warden-accent transition-colors"
        >
          <option value="gpt-4o-mini">GPT-4o</option>
          <option value="openrouter/anthropic/claude-3.5-sonnet">Claude 3.5</option>
          <option value="gemini-2.0-flash">Gemini 2.0</option>
        </select>

        <button onClick={handleClear} className="text-[10px] text-zinc-600 hover:text-red-400 transition px-1.5 py-1" title="Clear">🗑️</button>
        <div className="w-1.5 h-1.5 rounded-full bg-warden-accent pulse-ring" />
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="flex flex-col items-center gap-2 shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full border border-warden-accent/20 flex items-center justify-center bg-black overflow-hidden">
                  <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                {!streaming && msg.content && (
                  <button onClick={() => playTTS(msg.content)} className="text-[10px] text-zinc-600 hover:text-warden-accent" title="Play Voice">🔊</button>
                )}
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-warden-accent text-black font-bold rounded-tr-none shadow-[0_0_20px_rgba(0,240,255,0.1)]"
                  : "bg-zinc-900/40 text-zinc-200 border border-warden-border rounded-tl-none font-medium"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <TypingDots />}
        <div ref={endRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 glass border-t border-warden-border shrink-0">
        {/* Quick Actions / Example Tasks */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {[
            "swap 10 usdc to eth",
            "monitor my wallet",
            "bridge base -> op",
            "alert eth > $3k",
          ].map(task => (
            <button
              key={task}
              onClick={() => setInput(task)}
              className="chip chip-inactive whitespace-nowrap lowercase font-mono bg-zinc-900/50 hover:bg-warden-accent/10 hover:border-warden-accent/30 transition-all text-[9px]"
            >
              {task}
            </button>
          ))}
        </div>

        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="TYPE COMMAND..."
            disabled={loading}
            className="flex-1 bg-black border border-warden-border rounded-lg px-4 py-3 text-[13px] text-white focus:border-warden-accent transition-all placeholder:text-zinc-800 font-mono uppercase tracking-wider"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-lg bg-warden-accent text-black flex items-center justify-center disabled:opacity-20 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
