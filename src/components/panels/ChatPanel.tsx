"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const modelOptions = [
  { id: "qwen-plus", label: "Qwen Plus", desc: "Balanced" },
  { id: "qwen-turbo", label: "Qwen Turbo", desc: "Fast" },
  { id: "qwen-max", label: "Qwen Max", desc: "Advanced" },
  { id: "qwen2.5-72b-instruct", label: "Qwen 2.5 72B", desc: "Large" },
];

const suggestions = [
  "Swap 1 ETH to USDC on Base",
  "Check ETH price now",
  "Deploy a meme token on Base",
  "Bridge USDC from Ethereum to Base",
];

function TypewriterText({ content, speed = 18 }: { content: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);
  }, [content]);

  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= content.length) {
        setDisplayed(content);
        setDone(true);
        clearInterval(timer);
      } else {
        setDisplayed(content.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(timer);
  }, [content, speed, done]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block h-4 w-0.5 bg-[var(--accent)] animate-pulse ml-0.5" />}
    </span>
  );
}

export default function ChatPanel() {
  const [model, setModel] = useState(modelOptions[0].id);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat({
    api: "/api/chat",
    body: { modelId: model },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [completedMsgIds, setCompletedMsgIds] = useState<Set<string>>(new Set());

  const currentModel = modelOptions.find((m) => m.id === model) || modelOptions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant") {
        setCompletedMsgIds((prev) => new Set(prev).add(lastMsg.id));
      }
    }
  }, [isLoading, messages]);

  const handleSuggestion = useCallback((text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  }, [setInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }, [isLoading, input, handleSubmit]);

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-md">
            <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">mrxlolcat Agent</h2>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className={`status-dot ${isLoading ? "bg-[var(--orange)] animate-pulse" : "bg-[var(--teal)]"}`} />
              {isLoading ? "writing..." : "online"}
            </div>
          </div>
        </div>

        {/* Model selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModelMenu(!showModelMenu)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text)]"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            {currentModel.label}
            <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${showModelMenu ? "rotate-180" : ""}`}>
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          {showModelMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowModelMenu(false)} />
              <div className="dropdown-menu absolute right-0 top-full z-20 mt-1 w-52">
                {modelOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => { setModel(option.id); setShowModelMenu(false); }}
                    className={`dropdown-item ${model === option.id ? "text-[var(--accent)]" : ""}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${model === option.id ? "bg-[var(--accent)]" : "bg-[var(--text-hint)]"}`} />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-[10px] text-[var(--text-hint)]">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-12 animate-fade-in">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-lg animate-float">
              <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[var(--text)]">How can I help you today?</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Ask me about swaps, prices, deploying tokens, or anything on-chain.</p>
            </div>
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_80%,transparent)] px-4 py-3 text-left text-sm text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text)] hover:shadow-md hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((message, i) => {
          const isLastAssistant = message.role === "assistant" && i === messages.length - 1 && !completedMsgIds.has(message.id);
          return (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
              style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
            >
              {message.role === "user" ? (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--bg-card)] text-xs font-bold text-[var(--text-muted)]">
                  H
                </div>
              ) : (
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                  <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "rounded-tr-md border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--bg-card))]"
                    : "rounded-tl-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_88%,transparent)]"
                }`}
              >
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-hint)]">
                  {message.role === "user" ? "You" : "mrxlolcat"}
                </div>
                <div className="chat-message-content whitespace-pre-wrap">
                  {message.role === "assistant" && isLastAssistant && !isLoading ? (
                    <TypewriterText content={message.content} speed={16} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3 animate-fade-in">
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
              <Image src="/logo.jpeg" alt="mrxlolcat" fill className="object-cover" />
            </div>
            <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_88%,transparent)] px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)] [animation-delay:0.12s]" />
                <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)] [animation-delay:0.24s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="swap-card !p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className="input-field !rounded-xl !py-2.5 resize-none text-sm"
            placeholder="Ask mrxlolcat anything..."
            style={{ minHeight: "42px", maxHeight: "120px" }}
          />
          <div className="flex gap-1.5">
            {isLoading ? (
              <button type="button" onClick={stop} className="btn-secondary !rounded-xl h-[42px] w-[42px] !p-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary !rounded-xl h-[42px] w-[42px] !p-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
