"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    <div className="flex items-end gap-2 animate-fade-in">
      <div className="w-6 h-6 rounded-xl flex items-center justify-center text-[10px] shrink-0" style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)" }}>🐱</div>
      <div className="bg-zinc-800/60 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 border border-zinc-700/40">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full typing-dot" />
        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full typing-dot" />
      </div>
    </div>
  );
}

export default function Chat({ context, onBack }: ChatProps) {
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
        content: `hey ${user}! 🐱✨ i'm mrxlolcat-agent, your AI cat agent on farcaster.\n\nask me anything — crypto, swap, launch tokens, or cat philosophy 😼`,
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
        content: `memory cleared! 🧹 fresh start.\n\nhey ${user}! 🐱✨ what's up?`,
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
        { id: (Date.now() + 1).toString(), role: "assistant", content: "oops, cat brain crashed 😿 try again!" },
      ]);
      setLoading(false);
      setStreaming(false);
    }
  }, [input, loading, messages]);

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
    <div className="flex flex-col h-screen h-[100dvh] max-h-screen" style={{ background: "#09090B" }}>
      {/* Header */}
      <header className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60 shrink-0">
        {onBack && (
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        )}
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)" }}>
          🐱
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-sm gradient-text">mrxlolcat-agent</h1>
          <p className="text-[10px] text-zinc-500 truncate">
            {loading ? "typing…" : streaming ? "streaming…" : `ai agent · ${messages.length} msgs`}
          </p>
        </div>
        
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded-lg px-2 py-1 outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="openrouter/anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
        </select>

        <button onClick={handleClear} className="text-[10px] text-zinc-600 hover:text-red-400 transition px-1.5 py-1" title="Clear">🗑️</button>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-ring" />
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-6 h-6 rounded-xl flex items-center justify-center text-[10px]" style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)" }}>🐱</div>
                {!streaming && msg.content && (
                  <button onClick={() => playTTS(msg.content)} className="text-[10px] text-zinc-500 hover:text-indigo-400" title="Play Voice">🔊</button>
                )}
              </div>
            )}
            {msg.role === "user" && pfp && (
              <img src={pfp} alt="" className="w-7 h-7 rounded-full shrink-0 object-cover" />
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white rounded-br-sm"
                  : "bg-zinc-800/60 text-zinc-200 rounded-bl-sm border border-zinc-700/40"
              }`}
              style={msg.role === "user" ? { background: "linear-gradient(135deg, #6366F1, #8B5CF6)" } : undefined}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <TypingDots />}
        <div ref={endRef} />
      </main>

      {/* Input */}
      <footer className="glass px-3 py-3 border-t border-zinc-800/60 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="type a message…"
            disabled={loading}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-zinc-600 transition disabled:opacity-40"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-20 transition active:scale-90 btn-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
