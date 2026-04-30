# MRX LOLCAT Agent

AI automation agent for the Farcaster ecosystem, powered by Alibaba Cloud DashScope.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

## Features

- **DashScope AI** - Alibaba Cloud Qwen models (qwen-plus, qwen-turbo, qwen-max, qwen2.5-72b)
- **Farcaster Mini App** - Native mini app with SDK integration
- **Cross-Chain Bridge** - LI.FI Smart Routing (60+ chains)
- **Vector Memory** - FID-based long-term memory via Pinecone + DashScope embeddings
- **MCP Server** - Model Context Protocol for tool interoperability

## AI Configuration

| Setting | Value |
|---------|-------|
| Provider | Alibaba Cloud DashScope (Singapore) |
| Endpoint | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| Default Model | `qwen-plus` |
| Available Models | qwen-plus, qwen-turbo, qwen-max, qwen2.5-72b-instruct |
| Embeddings | `text-embedding-v3` (1024 dim) |

## Architecture

```
src/
  agent/
    core/         # brain.ts, orchestrator.ts, mcp.ts, logger.ts
    reasoning/    # provider.ts (DashScope only)
    memory/       # manager.ts (Pinecone + DashScope embeddings)
    tools/        # lifi.ts, farcaster.ts, frames.ts
    skills/       # SKILL.md
  app/            # Next.js App Router (pages + API routes)
  components/     # React UI components
  configs/        # constants.ts, lifi.ts, wagmi.ts
  providers/      # MiniApp.tsx, WalletProvider.tsx, wallet.ts
  types/          # Shared TypeScript interfaces
  lib/            # Client-side utilities
  docs/           # ARCHITECTURE.md
```

See [ARCHITECTURE.md](./src/docs/ARCHITECTURE.md) for detailed system flow.

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- DashScope API key ([Get from Alibaba Cloud Console](https://modelstudio.console.alibabacloud.com/))

### Local Development
```bash
git clone https://github.com/mrxlolcat/mrxlolcat-agent.git
cd mrxlolcat-agent
npm install
cp .env.example .env.local
# Edit .env.local - set DASHSCOPE_API_KEY
npm run dev
```

### Vercel Deployment
1. Fork this repository
2. Import to Vercel
3. Set environment variables (`DASHSCOPE_API_KEY` required)
4. Deploy

### Docker
```bash
docker compose up
```

## Farcaster Mini App

This app runs as a Farcaster Mini App. Configuration is in `public/.well-known/farcaster.json`.

To generate `accountAssociation`, visit: https://farcaster.xyz/~/developers/mini-apps/manifest

## Roadmap

- [x] v3.0: Modular Agent Core & LI.FI Integration
- [x] v3.1: DashScope AI Integration
- [x] v3.2: Repository cleanup & DashScope-first architecture
- [ ] v3.3: Portfolio Monitoring Alerts
- [ ] v4.0: Multi-Agent Collaboration

## License

[MIT](./LICENSE)
