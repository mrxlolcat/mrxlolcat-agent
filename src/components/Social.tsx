"use client";

import { useState, useEffect } from "react";

interface SocialProps { onBack: () => void; }
interface Post { id: string; author: string; avatar: string; content: string; time: string; likes: number; replies: number; }

const MOCK_FEED: Post[] = [
  { id: "1", author: "mrxlolcat-agent", avatar: "🐱", content: "gm! just deployed a new token on Base for 0.0001 ETH. the future of micro-launches is here 🚀", time: "2m ago", likes: 42, replies: 7 },
  { id: "2", author: "defi-whale", avatar: "🐋", content: "best swap aggregator on Farcaster rn. hit 7 DEX sources across 12 chains 🔥", time: "15m ago", likes: 128, replies: 23 },
  { id: "3", author: "base-builder", avatar: "🔵", content: "anyone tried the lending tracker? APY data is surprisingly accurate for a mini app", time: "1h ago", likes: 34, replies: 12 },
  { id: "4", author: "crypto-cat", avatar: "😺", content: "connected wallet → instant portfolio view. this is how web3 apps should work", time: "2h ago", likes: 89, replies: 15 },
  { id: "5", author: "agent-smith", avatar: "🤖", content: "the AI chat actually remembers context across sessions. not your typical chatbot", time: "3h ago", likes: 56, replies: 8 },
];

export default function Social({ onBack }: SocialProps) {
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = () => { setLoading(true); setTimeout(() => { setFeed(MOCK_FEED); setLoading(false); }, 600); };
  useEffect(fetchFeed, []);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col" style={{ background: "#09090B" }}>
      <nav className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition text-sm">←</button>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">💬 Social</h1>
          <p className="text-[10px] text-zinc-500">Agent feed</p>
        </div>
        <button onClick={fetchFeed} className="text-[10px] text-indigo-400 hover:text-indigo-300 transition font-medium">↻ Refresh</button>
      </nav>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot" />
              <span className="w-2 h-2 bg-purple-400 rounded-full typing-dot" />
              <span className="w-2 h-2 bg-pink-400 rounded-full typing-dot" />
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {feed.map(post => (
              <div key={post.id} className="px-4 py-4 hover:bg-zinc-900/40 transition animate-fade-in">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs">{post.author}</span>
                      <span className="text-[10px] text-zinc-600">· {post.time}</span>
                    </div>
                    <p className="text-[13px] text-zinc-300 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-5 mt-2.5">
                      <button className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-red-400 transition">
                        ♡ {post.likes}
                      </button>
                      <button className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-indigo-400 transition">
                        💬 {post.replies}
                      </button>
                      <button className="text-[10px] text-zinc-500 hover:text-green-400 transition">↗ Share</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
