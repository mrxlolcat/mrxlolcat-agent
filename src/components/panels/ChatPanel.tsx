"use client";

import { useChat } from "ai/react";
import { useMemo, useState } from "react";

const modelOptions = ["gpt-4o", "gpt-4o-mini", "qwen-plus"];

export default function ChatPanel() {
  const [model, setModel] = useState(modelOptions[0]);
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
    body: { modelId: model },
  });

  const status = useMemo(() => (isLoading ? "typing" : "ready"), [isLoading]);

  return (
    <section className="panel-card flex min-h-[680px] flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="panel-title">Chat</div>
          <h2 className="mt-2 text-2xl font-semibold">AI Agent Console</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Vercel AI SDK streaming chat with Farcaster-friendly formatting.</p>
        </div>
        <div className="rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)]">
          status: <span className="text-[var(--teal)]">{status}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="rounded-[24px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-card)_92%,transparent)] p-5 text-sm text-[var(--text-muted)]">
            Mulai percakapan untuk melihat bubble chat.
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "rounded-tr-md border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--accent)_18%,var(--bg-card))] text-[var(--text)]"
                  : "rounded-tl-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_88%,transparent)] text-[var(--text)]"
              }`}
            >
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[var(--text-hint)]">
                {message.role === "user" ? "You" : "AI"}
              </div>
              <div>{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-[24px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_88%,transparent)] px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="typing-dot h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                <span className="typing-dot h-2.5 w-2.5 rounded-full bg-[var(--accent)] [animation-delay:0.12s]" />
                <span className="typing-dot h-2.5 w-2.5 rounded-full bg-[var(--accent)] [animation-delay:0.24s]" />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="rounded-[28px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-surface)_90%,transparent)] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Message</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              rows={3}
              className="input-field resize-none mono"
              placeholder="Ketik instruksi atau pertanyaan..."
            />
          </div>
          <div className="min-w-[180px]">
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-[var(--text-hint)]">Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="input-field mono">
              {modelOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary h-12 px-5" disabled={isLoading}>
              Send
            </button>
            {isLoading ? (
              <button type="button" onClick={stop} className="btn-secondary h-12 px-5">
                Stop
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
}
