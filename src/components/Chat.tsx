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
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full border border-warden-accent/20 flex items-center justify-center bg-black/40 backdrop-blur-md shrink-0 mt-1 overflow-hidden shadow-premium">
        <div className="w-full h-full bg-warden-accent/5 flex items-center justify-center">
          <span className="w-1 h-1 bg-warden-accent rounded-full animate-pulse" />
        </div>
      </div>
      <div className="bg-zinc-900/20 backdrop-blur-lg rounded-2xl rounded-tl-none px-5 py-3.5 flex gap-2 border border-white/5">
        <span className="w-1.5 h-1.5 bg-warden-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-warden-accent/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-warden-accent/20 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

export default function Chat({ context }: { context: any }) {
  const { address } = useAccount();
  const user = context?.user?.displayName || context?.user?.username || "Authorized_User";

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = loadHistory();
    if (stored.length > 0) return stored.map((m) => ({ id: m.id, role: m.role, content: m.content }));
    return [{ id: "welcome", role: "assistant", content: `Terminal active. Secure session initiated for ${user}.` }];
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
      setMessages((prev) => [...prev, { 
        id: (Date.now() + 2).toString(), 
        role: "assistant", 
        content: "Network interruption. Please re-authenticate command." 
      }]);
    }
  }, [input, loading, messages, address, context]);

  return (
    <div className="flex flex-col h-full bg-warden-bg text-zinc-300 font-sans selection:bg-warden-accent/30">
      {/* Premium Header */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warden-accent/20 to-transparent border border-warden-accent/30 flex items-center justify-center group cursor-pointer hover:border-warden-accent/60 transition-all duration-500 shadow-premium">
            <div className="w-5 h-5 bg-warden-accent/80 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
              MRX_LOLCAT <span className="text-[10px] bg-warden-accent/10 text-warden-accent px-1.5 py-0.5 rounded border border-warden-accent/20 font-mono tracking-tighter">V4.1</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">System_Encrypted_Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end gap-1 px-4 border-r border-white/5">
            <span className="text-[8px] font-mono text-zinc-600 uppercase">Latency_Ping</span>
            <span className="text-[10px] font-mono text-warden-accent tracking-tighter">12ms</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/5 text-zinc-400 text-[10px] font-bold uppercase rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 bg-warden-accent rounded-full animate-pulse" />
              AUTO_REASONING
            </div>
            <button 
              onClick={() => { clearHistory(); setMessages([{ id: "w", role: "assistant", content: "Memory cleared. Workspace reset." }]); }} 
              className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-500 transition-all group shadow-premium"
              title="Reset Workspace"
            >
              <svg className="w-4 h-4 group-active:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Message Feed */}
      <main className="flex-1 overflow-y-auto px-6 py-10 scroll-smooth no-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.03)_0%,transparent_50%)]">
        <div className="max-w-5xl mx-auto space-y-12">
          {messages.map((msg, idx) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-5 ${msg.role === "user" ? "flex-row-reverse" : "animate-fade-in"}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-2xl border border-warden-accent/20 bg-black/40 backdrop-blur-xl shrink-0 mt-1 flex items-center justify-center group overflow-hidden shadow-premium relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-warden-accent/5 to-transparent opacity-50" />
                   <div className="w-5 h-5 bg-warden-accent/60 rounded-[4px] rotate-45 shadow-[0_0_10px_rgba(0,240,255,0.3)] group-hover:rotate-90 transition-transform duration-700" />
                </div>
              )}
              <div className={`group relative max-w-[85%] md:max-w-[75%] rounded-3xl px-6 py-4 text-[14px] leading-relaxed tracking-wide transition-all ${
                msg.role === "user" 
                  ? "bg-gradient-to-br from-zinc-100 to-zinc-300 text-black font-semibold rounded-tr-none shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-[1.01]" 
                  : "bg-white/[0.03] backdrop-blur-md text-zinc-200 border border-white/5 rounded-tl-none hover:bg-white/[0.05] hover:border-white/10 shadow-premium"
              }`}>
                {msg.content}
                {msg.role === "assistant" && (
                  <div className="absolute -bottom-6 left-1 text-[8px] font-mono text-zinc-700 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    Authorized_Agent_Response_{msg.id.slice(-4)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <TypingDots />}
          <div ref={endRef} />
        </div>
      </main>

      {/* Control Panel */}
      <footer className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <div className="max-w-5xl mx-auto">
          {/* Action Chips */}
          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
            {[
              { label: "Portfolio_Analysis", icon: "📊" },
              { label: "Bridge_Assets", icon: "⚡" },
              { label: "Swap_Tokens", icon: "🔄" },
              { label: "Network_Status", icon: "🌐" }
            ].map(task => (
              <button 
                key={task.label} 
                onClick={() => setInput(task.label.toLowerCase().replace('_', ' '))} 
                className="px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold text-zinc-500 uppercase hover:border-warden-accent/40 hover:text-white hover:bg-warden-accent/5 transition-all flex items-center gap-2 group whitespace-nowrap shadow-premium"
              >
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">{task.icon}</span>
                {task.label}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1 relative group bg-white/5 rounded-2xl border border-white/5 focus-within:border-warden-accent/30 focus-within:bg-white/[0.08] transition-all p-1 shadow-premium">
              <textarea 
                rows={1}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }} 
                placeholder="ENTER_COMMAND_SEQUENCE..." 
                disabled={loading} 
                className="w-full bg-transparent border-none rounded-xl px-5 py-4 text-[14px] text-white focus:ring-0 outline-none resize-none min-h-[56px] font-mono tracking-widest placeholder:text-zinc-800" 
              />
              <div className="absolute right-5 bottom-4 text-[9px] font-mono text-zinc-700 flex items-center gap-3">
                <span className="hidden md:block">SHIFT + ENTER = NEWLINE</span>
                <span className="text-warden-accent/40">LN_SEC_0{messages.length}</span>
              </div>
            </div>
            
            <button 
              onClick={send} 
              disabled={loading || !input.trim()} 
              className="group w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-warden-accent hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:grayscale disabled:hover:shadow-none shadow-premium"
            >
              <svg className="w-7 h-7 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
