# MRX LOLCAT Agent 🤠✨

The high-tech AI automation terminal for the Farcaster Agentic Economy.

[![CI](https://github.com/mrxlolcat/mrxlolcat-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/mrxlolcat/mrxlolcat-agent/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features
- **Automation Engine**: AI-driven on-chain task execution.
- **Omnichain Bridge**: Powered by LI.FI (60+ chains).
- **Long-Term Memory**: FID-based vector storage via Pinecone.
- **Multi-LLM Reasoning**: GPT-4o, Claude 3.5, and Gemini support via OpenRouter.
- **Interactive Frames**: Native Farcaster Mini App experience.

## ⚠️ Security Warning
**NEVER share or store your private keys in plain text.** 
MRX LOLCAT is designed to be non-custodial. All on-chain actions requiring signatures are handled via industry-standard providers (Wagmi/Reown). Always verify transaction details in your wallet before signing.

## 🛠️ Architecture
Detailed documentation can be found in [ARCHITECTURE.md](./src/docs/ARCHITECTURE.md).

## 🗺️ Roadmap
- [x] v3.0: Modular Agent Core & LI.FI Integration
- [ ] v3.1: Autonomous Portfolio Monitoring Alerts
- [ ] v3.2: Multi-Agent Collaboration (Swarm Mode)
- [ ] v4.0: Intent-based Direct Transaction Execution (AA)

## 📦 Getting Started

### Local Development
1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in the keys.
4. `npm run dev`

### Docker
```bash
docker compose up
```

## 📄 License
This project is licensed under the [MIT License](./LICENSE).
