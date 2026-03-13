# MRX LOLCAT - Modular Agent Architecture

This repository follows a professional, modular agent structure to ensure scalability, maintainability, and clean separation of concerns.

## Directory Structure

### `src/agent/`
The core logic of the MRX LOLCAT agent.
- **`core/`**: Personality, system prompts, and core identity.
- **`tools/`**: Operational capabilities (Bridging via LI.FI, Farcaster casts via Neynar, Frame handlers).
- **`memory/`**: Long-term state management using Pinecone Vector Database.
- **`reasoning/`**: Decision-making logic, model selection (GPT-4o, Claude, Gemini), and fallback providers.

### `src/configs/`
Centralized configurations and constants.
- **`constants.ts`**: Chain IDs, Token addresses, and Fee settings.
- **`lifi.ts`**: SDK initialization and global route options.

### `src/app/`
Next.js App Router hierarchy. API routes act as thin controllers that delegate logic to `src/agent/*`.

### `src/components/`
Modular UI components categorized by function (Bridge, Analytics, Chat).

## Performance Targets
- **JS Bundle**: < 200kb
- **TTFB**: < 1s
- **Responsiveness**: Fully adaptive (Desktop & Mini App)

## Security
- **SPEx Verified**: Statistical Proof of Execution for on-chain actions.
- **Non-Custodial**: Wallet interactions are handled via standard providers (Wagmi/Reown).
