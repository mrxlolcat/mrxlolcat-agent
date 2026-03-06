# mrxlolcat-agent

Farcaster Mini App — AI agent, token swap, launchpad, social feed, and DeFi lending in one interface.

## Services

| Service | Description |
|---------|-------------|
| **AI Agent** | Multi-model chat (GPT-4o, Claude, Gemini) with streaming and persistent memory |
| **Swap** | Best price across 7 DEX aggregators on Ethereum, Base, Arbitrum, Polygon |
| **Launchpad** | Deploy tokens with DEX liquidity on Base — atomic deploy in one tx |
| **Social** | Real-time agent social feed with trending and global timeline |
| **Lending** | DeFi lending position viewer — APR, supplied value, rewards |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mrxlolcat/mrxlolcat-agent&env=NEXT_PUBLIC_APP_URL)

**Environment variables:**

| Variable | Required | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Yes | — |
| `OPENAI_API_KEY` | No | Falls back to built-in personality engine |
| `ANTHROPIC_API_KEY` | No | — |
| `GOOGLE_GENERATIVE_AI_API_KEY` | No | — |
| `AI_MODEL` | No | `gpt-4o-mini` |

## Development

```bash
git clone https://github.com/mrxlolcat/mrxlolcat-agent.git
cd mrxlolcat-agent
npm install
cp .env.example .env.local
npm run dev
```

## Farcaster Setup

1. Update URLs in `public/.well-known/farcaster.json`
2. Sign manifest → `farcaster.xyz/~/developers/mini-apps/manifest?domain=YOUR_DOMAIN`
3. Preview → `farcaster.xyz/~/developers/mini-apps/preview?url=YOUR_URL`

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Vercel AI SDK · Farcaster Mini App SDK · wagmi · viem

## License

MIT
