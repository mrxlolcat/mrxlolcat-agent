"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { loadHistory, saveHistory, clearHistory, type StoredMessage } from "~/lib/memory";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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

export default function Chat({ context }: { context: any }) {
  const { address } = useAccount();
  const user = context?.user?.displayName || context?.user?.username || "anon";

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadHistory();
    if (stored.length > 0) return stored.map((m) => ({ id: m.id, role: m.role, content: m.content }));
    return [{ id: "welcome", role: "assistant", content: `system ready. 🤠 welcome, ${user}.` }];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveHistory(messages.map(m => ({ ...m, timestamp: Date.now() })));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                  setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m)));
                } catch { }
              }
            }
          }
        }
        setStreaming(false);
      } else {
        const data = await res.json();
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.content }]);
        setLoading(false);
      }
    } catch {
      setLoading(false);
      setStreaming(false);
    }
  }, [input, loading, messages, address, selectedModel, context]);

  return (
    <div className="flex flex-col h-full bg-black">
      <header className="glass border-b border-warden-border flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" className="w-8 h-8 rounded-full border border-warden-accent/30" />
          <h1 className="font-bold text-[11px] uppercase tracking-widest text-white">MRX<span className="text-warden-accent">LOLCAT</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="bg-black border border-warden-border text-zinc-400 text-[9px] font-bold uppercase rounded-md px-2 py-1 outline-none">
            <option value="gpt-4o-mini">GPT-4o</option>
            <option value="openrouter/anthropic/claude-3.5-sonnet">Claude 3.5</option>
          </select>
          <button onClick={() => { clearHistory(); setMessages([{ id: "w", role: "assistant", content: "memory cleared." }]); }} className="text-[10px] text-zinc-600 hover:text-red-400">🗑️</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && <img src="/logo.jpg" className="w-6 h-6 rounded-full border border-warden-accent/20 mt-1" />}
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === "user" ? "bg-warden-accent text-black font-bold" : "bg-zinc-900/40 text-zinc-200 border border-warden-border"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <TypingDots />}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="p-4 border-t border-warden-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="TYPE COMMAND..." disabled={loading} className="flex-1 bg-black border border-warden-border rounded-lg px-4 py-3 text-[13px] text-white focus:border-warden-accent font-mono uppercase tracking-wider" />
            <button onClick={send} disabled={loading || !input.trim()} className="w-12 h-12 rounded-lg bg-warden-accent text-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
