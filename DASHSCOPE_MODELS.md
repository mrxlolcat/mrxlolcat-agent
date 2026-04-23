# DashScope Model Reference (Singapore Endpoint)

**API Endpoint:** `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`  
**API Key:** Set in `DASHSCOPE_API_KEY` environment variable

## ✅ Available Models (9 models)

### Text Models

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| `qwen-plus` | ⚡⚡⚡ | ⭐⭐⭐ | **Default**, balanced tasks |
| `qwen-turbo` | ⚡⚡⚡⚡ | ⭐⭐ | Fast responses, simple tasks |
| `qwen-max` | ⚡⚡ | ⭐⭐⭐⭐ | Complex reasoning, advanced tasks |
| `qwen2.5-72b-instruct` | ⚡ | ⭐⭐⭐⭐⭐ | Large model, best quality |
| `qwen2.5-32b-instruct` | ⚡⚡ | ⭐⭐⭐⭐ | Medium tasks |
| `qwen2.5-14b-instruct` | ⚡⚡⚡ | ⭐⭐⭐ | Small tasks |
| `qwen2.5-7b-instruct` | ⚡⚡⚡⚡ | ⭐⭐ | Tiny, fastest |

### Vision Models

| Model | Capability |
|-------|------------|
| `qwen-vl-plus` | Image understanding, scene description |
| `qwen-vl-max` | Advanced vision, detailed analysis |

## 🎯 Model Selection Guide

```
┌─────────────────────────────────────────────────────────────┐
│                    MODEL SELECTION FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Need VISION?                                               │
│    ├─ Yes → qwen-vl-plus (fast) or qwen-vl-max (advanced)   │
│    └─ No ↓                                                  │
│                                                              │
│  Need SPEED?                                                │
│    ├─ Yes → qwen-turbo (fastest) or qwen2.5-7b-instruct     │
│    └─ No ↓                                                  │
│                                                              │
│  Need QUALITY?                                              │
│    ├─ High → qwen-max or qwen2.5-72b-instruct               │
│    └─ Balanced → qwen-plus (DEFAULT)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Test Results Summary

### Basic Chat Tests (5/6 passed)
- ✅ qwen-plus - "Halo!" (2596ms)
- ✅ qwen-turbo - Fast response
- ✅ qwen-max - Detailed response
- ✅ qwen2.5-72b-instruct - High quality
- ✅ qwen-vl-plus - Vision working
- ❌ qwen-long - Not available

### Code Generation Tests (6/6 passed)
- ✅ React/TypeScript components
- ✅ Python functions
- ✅ Solidity smart contracts
- ✅ Rust programs
- ✅ Go HTTP servers
- ✅ SQL schemas
- ✅ Shell scripts
- ✅ Docker Compose
- ✅ GraphQL schemas

### Advanced Tests (6/6 passed)
- ✅ Streaming (13 chunks, 1586ms)
- ✅ Vision analysis
- ✅ Math reasoning (step-by-step)
- ✅ Chain-of-thought reasoning
- ✅ Translation (Indonesian)
- ✅ Creative writing

## 🔧 Integration

### Environment Setup
```bash
# .env.local
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL=qwen-plus  # default
```

### Usage in Code
```typescript
import { getModel } from "@/agent/reasoning/provider";

// Default model (qwen-plus)
const model = await getModel();

// Specific model
const fastModel = await getModel("qwen-turbo");
const visionModel = await getModel("qwen-vl-max");
const advancedModel = await getModel("qwen-max");
```

### Legacy Model Mapping
```typescript
"gpt-4o-mini" → "qwen-plus"
"gpt-4o" → "qwen-max"
"claude-3.5-sonnet" → "qwen2.5-72b-instruct"
"gemini-1.5-flash" → "qwen-turbo"
```

## ❌ Unavailable Models

These models were tested but not available on Singapore endpoint:
- `qwen-max-longcontext`
- `qwen2-72b-instruct`
- `qwen-audio-turbo` / `qwen-audio-plus`
- `qwen-vl-video` / `qwen-vl-video-plus`
- `qwen-long`
- `qwen-qwq-32b-preview`
- `deepseek-r1` / `deepseek-v3`

## 📝 Notes

1. **Singapore Endpoint**: Use `dashscope-intl.aliyuncs.com` (not `dashscope.aliyuncs.com`)
2. **Streaming**: All models support streaming with `stream: true`
3. **Vision**: `qwen-vl-plus` and `qwen-vl-max` can analyze images (video not available)
4. **Latency**: Singapore endpoint provides good latency for SEA region (~700-2500ms for simple queries)

---

*Last updated: 2026-04-23*
