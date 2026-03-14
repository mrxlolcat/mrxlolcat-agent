"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { loadHistory, saveHistory, clearHistory } from "~/lib/memory";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function TypingDots() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-6 h-6 rounded-full border border-warden-accent/20 flex items-center justify-center bg-black shrink-0 mt-1 overflow-hidden">
        <img src="/logo.jpg" className="w-full h-full object-cover" />
      </div>
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
          modelId: "gpt-4o-mini",
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
    } catch (error) {
      console.error("Chat error:", error);
      setLoading(false);
      setStreaming(false);
      // Add error message to chat
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 2).toString(), 
        role: "assistant", 
        content: "Network error. Please try again. 😿" 
      }]);
    }
  }, [input, loading, messages, address, selectedModel, context]);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Dynamic Header */}
      <header className="glass border-b border-warden-border flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex flex-col">
          <h1 className="font-bold text-[11px] uppercase tracking-widest text-white">Agent<span className="text-warden-accent">Terminal</span></h1>
          <p className="text-[8px] font-mono text-zinc-500 uppercase">Secure_Session_Active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black border border-warden-border text-warden-accent text-[9px] font-bold uppercase rounded px-2 py-1 outline-none flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <span className="w-1 h-1 bg-warden-accent rounded-full animate-pulse" />
            AUTO_MODE
          </div>
          <button onClick={() => { clearHistory(); setMessages([{ id: "w", role: "assistant", content: "memory cleared." }]); }} className="bg-zinc-900/50 p-1.5 rounded border border-warden-border hover:border-red-500/50 text-zinc-600 hover:text-red-500 transition-all">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full border border-warden-accent/20 bg-black shrink-0 mt-1 overflow-hidden shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                  <img src="/logo.jpg" className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-[13px] leading-relaxed tracking-wide ${msg.role === "user" ? "bg-warden-accent text-black font-bold rounded-tr-none shadow-[0_0_20px_rgba(0,240,255,0.1)]" : "bg-zinc-900/30 text-zinc-200 border border-warden-border rounded-tl-none"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <TypingDots />}
          <div ref={endRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="p-6 border-t border-warden-border bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {["swap 10 usdc", "monitor wallet", "bridge base->op"].map(task => (
              <button key={task} onClick={() => setInput(task)} className="px-3 py-1.5 rounded-md border border-warden-border bg-zinc-900/50 text-[9px] font-mono text-zinc-500 uppercase hover:border-warden-accent/30 hover:text-warden-accent transition-all whitespace-nowrap">
                {task}_
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="EXECUTE_COMMAND..." disabled={loading} className="w-full bg-zinc-900/30 border border-warden-border rounded-xl px-5 py-4 text-[13px] text-white focus:border-warden-accent transition-all font-mono uppercase tracking-widest placeholder:text-zinc-800" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-700 pointer-events-none group-focus-within:text-warden-accent/50 transition-colors">
                LN_01
              </div>
            </div>
            <button onClick={send} disabled={loading || !input.trim()} className="w-14 h-14 rounded-xl bg-warden-accent text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
