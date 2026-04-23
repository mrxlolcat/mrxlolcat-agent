# MRX LOLCAT Agent 🤠✨

The high-tech AI automation terminal for the Farcaster Agentic Economy.

[![CI](https://github.com/mrxlolcat/mrxlolcat-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/mrxlolcat/mrxlolcat-agent/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features
- **AI-Powered by Qwen**: Alibaba Cloud DashScope integration (Singapore region)
- **Automation Engine**: AI-driven on-chain task execution.
- **Omnichain Bridge**: Powered by LI.FI (60+ chains).
- **Long-Term Memory**: FID-based vector storage via Pinecone.
- **Multi-LLM Reasoning**: Qwen-plus, Qwen-turbo, Qwen-max, Qwen2.5-72b via DashScope.
- **Agent Skills**: Built with [Agent Skills Specification](https://agentskills.io/specification).
- **Interactive Frames**: Native Farcaster Mini App experience.

## 🤖 AI Configuration
- **Provider**: Alibaba Cloud DashScope (Singapore)
- **Endpoint**: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
- **Models**: 
  - `qwen-plus` (default) - Balanced performance
  - `qwen-turbo` - Fast responses
  - `qwen-max` - Advanced reasoning
  - `qwen2.5-72b-instruct` - Large model capability

## 🧠 Agent Skills
This agent supports modular skills located in `src/agent/skills/`.
- `bridge-skill`: Cross-chain transfers.
- `monitor-skill`: Real-time monitoring.
- `social-skill`: Farcaster interactions.

## ⚠️ Security Warning
**NEVER share or store your private keys in plain text.** 
MRX LOLCAT is designed to be non-custodial. All on-chain actions requiring signatures are handled via industry-standard providers (Wagmi/Reown). Always verify transaction details in your wallet before signing.

## 🛠️ Architecture
Detailed documentation can be found in [ARCHITECTURE.md](./src/docs/ARCHITECTURE.md).

## 🗺️ Roadmap
- [x] v3.0: Modular Agent Core & LI.FI Integration
- [x] v3.1: DashScope AI Integration (Singapore)
- [ ] v3.2: Portfolio Monitoring Alerts
- [ ] v3.3: Multi-Agent Collaboration (Swarm Mode)
- [ ] v4.0: Intent-based Direct Transaction Execution (AA)

## 📦 Getting Started

### Local Development
1. Clone the repo.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in the keys.
   - **Required**: `DASHSCOPE_API_KEY` (get from [Alibaba Cloud Console](https://modelstudio.console.alibabacloud.com/))
4. `npm run dev`

### Vercel Deployment
1. Fork this repository
2. Import to Vercel
3. Set environment variables:
   - `DASHSCOPE_API_KEY` - Your Alibaba Cloud DashScope API key
   - Other keys as needed (Pinecone, Neynar, etc.)
4. Deploy!

### Docker
```bash
docker compose up
```

## 📄 License
This project is licensed under the [MIT License](./LICENSE).
