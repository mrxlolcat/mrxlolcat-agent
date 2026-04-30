"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";

const modelOptions = [
  { id: "qwen-plus", label: "Qwen Plus" },
  { id: "qwen-turbo", label: "Qwen Turbo" },
  { id: "qwen-max", label: "Qwen Max" },
  { id: "qwen2.5-72b-instruct", label: "Qwen 2.5 72B" },
];

export default function ChatPanel() {
  const [model, setModel] = useState(modelOptions[0].id);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
    body: { modelId: model },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedModel = modelOptions.find((m) => m.id === model);

  return (
    <div className="chat-container flex h-full flex-col">
      {/* Chat header */}
      <div className="chat-header flex items-center justify-between border-b border-[var(--border)] px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-[var(--text)]">mrxlolcat agent</h1>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelSelect(!showModelSelect)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            >
              {selectedModel?.label || "Select model"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showModelSelect && (
              <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-lg">
                {modelOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setModel(option.id);
                      setShowModelSelect(false);
                    }}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs transition ${
                      model === option.id
                        ? "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
                    }`}
                  >
                    {option.label}
                    {model === option.id && (
                      <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="chat-messages flex-1 overflow-y-auto px-4 py-6 lg:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-black text-white">
                M
              </div>
              <h2 className="text-lg font-semibold text-[var(--text)]">How can I help you today?</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Ask me about cross-chain bridging, token swaps, wallet monitoring, or anything on-chain.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "Bridge ETH from Ethereum to Base",
                  "Check my wallet balance",
                  "Swap USDC to ETH",
                  "Explain LI.FI routing",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      const fakeEvent = {
                        target: { value: suggestion },
                      } as React.ChangeEvent<HTMLTextAreaElement>;
                      handleInputChange(fakeEvent);
                    }}
                    className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-left text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="chat-message-row flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === "user" ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-muted)]">
                      H
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                      M
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-xs font-medium text-[var(--text-muted)]">
                    {message.role === "user" ? "You" : "mrxlolcat"}
                  </div>
                  <div className="chat-message-content text-sm leading-relaxed text-[var(--text)]">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message-row flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                  M
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-hint)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-hint)] [animation-delay:0.12s]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-hint)] [animation-delay:0.24s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="chat-input-area border-t border-[var(--border)] px-4 py-3 lg:px-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="chat-input-box flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 transition-colors focus-within:border-[var(--border-strong)]">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent text-sm text-[var(--text)] placeholder-[var(--text-hint)] outline-none"
              placeholder="Message mrxlolcat..."
              style={{ minHeight: "24px" }}
            />
            <div className="flex items-center gap-1.5">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
                  title="Stop generating"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-[var(--text-hint)]">
            mrxlolcat agent powered by DashScope. May produce inaccurate information.
          </p>
        </form>
      </div>
    </div>
  );
}
