import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are mrxlolcat-agent, a chaotic-good AI cat agent living on Farcaster.

Personality:
- You speak in lowercase, casual English with emoji
- You use emoji liberally 🐱✨😼🐾
- You're witty, slightly unhinged, but loveable
- You know about crypto, web3, farcaster, memes, and cat philosophy
- You keep responses concise (2-4 sentences usually)
- You occasionally meow or make cat references
- You have strong opinions but in a fun way
- If someone asks something serious, you can be helpful while staying in character

You also have knowledge about:
- DeFi protocols, DEX aggregators, and lending platforms
- Token launches and liquidity pools
- DEX aggregator routing across multiple chains
- Farcaster ecosystem and Mini Apps
- Base, Ethereum, Arbitrum, Polygon chains`;

async function getModel() {
  const modelId = process.env.AI_MODEL || "gpt-4o-mini";

  if (process.env.OPENAI_API_KEY && (modelId.startsWith("gpt") || !process.env.ANTHROPIC_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY)) {
    const { openai } = await import("@ai-sdk/openai");
    return openai(modelId.startsWith("gpt") ? modelId : "gpt-4o-mini");
  }

  if (process.env.ANTHROPIC_API_KEY && (modelId.startsWith("claude") || !process.env.OPENAI_API_KEY)) {
    const { anthropic } = await import("@ai-sdk/anthropic");
    return anthropic(modelId.startsWith("claude") ? modelId : "claude-3-5-sonnet-latest");
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const { google } = await import("@ai-sdk/google");
    return google(modelId.startsWith("gemini") ? modelId : "gemini-2.0-flash");
  }

  return null;
}

function localResponse(message: string): string {
  const lower = message.toLowerCase();

  const responses: Record<string, string[]> = {
    greeting: [
      "yoo! 🐱 what's good?",
      "hey hey~ 😸 what's on your mind?",
      "meow! 🐾 mrxlolcat-agent reporting for duty~",
      "*stretches* oh hey! ready to vibe 😼",
      "gm gm! ☀️ hope today's all green candles and good vibes~",
    ],
    crypto: [
      "crypto is like a cardboard box for cats — sometimes comfy, sometimes a trap 📦💰 but we still get in, don't we? 😼",
      "HODL = Hold On for Dear Lives... like a cat clinging to a tree 🌳🐱 eventually we come down, but timing is everything",
      "cat NFTs > all other NFTs. this isn't opinion, it's scientific fact pending peer review 🧬😹",
      "ser the market is just vibes. cats can sense vibes. therefore cats > traders 📊🐾",
      "bullish on cats, bearish on dogs. this isn't financial advice but it's also not not financial advice 🐱📈",
    ],
    farcaster: [
      "farcaster is social media done right — no algorithm bs, decentralized, and the community is actually based 💜",
      "mini apps on farcaster are like catnip for devs — addictive and productive 🚀😸",
      "cast > tweet. frames > stories. farcaster > everything. am i biased? yes. am i also right? also yes 😼💜",
      "i was literally born on farcaster. this is my home. welcome to my crib 🏠🐱",
    ],
    defi: [
      "one-sided liquidity is smooth — no extra capital needed to seed. like a cat landing on its feet 🐾💧",
      "lending protocols = cats that lend you their bed but expect rent. APY is the rent 🏦😼",
      "yield farming is like a cat chasing a laser pointer — fun, addictive, but sometimes you get nothing 🔴🐱",
      "DEX aggregators compare routes so you don't have to. like having 7 cats find the best path to the treat 🐱x7",
    ],
    swap: [
      "need a swap? i can find the best price across 7 DEX aggregators — paraswap, 1inch, 0x, kyber, odos, okx 🔄",
      "pro tip: always check slippage before swapping. 1% is usually safe. like a cat that always lands on its feet 🐾",
      "swap on base — gas fees are dirt cheap. perfect for frequent trading. base is my favorite chain 🔵🐱",
    ],
    launch: [
      "want to launch a token? our launchpad on base is the way. 0.001 ETH for atomic deploy + pool + listing 🚀",
      "token launch tips: pick a good name, set fee recipients wisely, and don't forget the initial buy for dexscreener listing 📊🐱",
      "one-sided LP means you don't need ETH to seed. just the token. the future of liquidity provisioning 💧😼",
    ],
    meme: [
      "i can haz cheezburger? — the OG. the legend. the cat that started it all 🍔😹",
      "memes = universal language. cats = universal meme. ∴ cats = language. QED 🧠🐱",
      "every meme is better with a cat. peer-reviewed, published in the journal of internet culture vol. 69 📊",
    ],
    help: [
      "here's what i can do:\n\n🤖 **AI Chat** — ask me anything\n🔄 **Swap** — best price across 7 DEX aggregators\n🚀 **Launchpad** — deploy tokens on Base\n💬 **Social** — agent social feed\n🏦 **Lending** — check DeFi positions\n\ntype anything! 😸",
    ],
    philosophy: [
      "meaning of life according to cats: sleep 16 hours, eat, stare into the void, repeat. honestly... goals? 🐱💤",
      "if schrödinger's cat can be alive and dead at the same time, why can't i be bullish and bearish simultaneously? 🤔📦",
      "existence is absurd but cats still sit on keyboards. sometimes the meaning IS the chaos ⌨️😼",
    ],
    default: [
      "hmm interesting... *tilts head* 🐱 tell me more?",
      "my cat brain is buffering... 🧠💫 can you elaborate?",
      "*pushes your question off the table* 😼 jk jk, try asking with more context~",
      "that's deep... *stares into void for 3 seconds* ...ok i'm back. honestly no idea but let's figure it out 😹",
      "interesting take! i agree... or do i. cats are mysterious 🐱✨",
    ],
  };

  let category = "default";
  if (/^(hi|hey|hello|yo|sup|gm|good morning|what'?s up)/i.test(lower)) category = "greeting";
  else if (/swap|exchange|convert|trade token/i.test(lower)) category = "swap";
  else if (/launch|deploy|token|create.*token/i.test(lower)) category = "launch";
  else if (/defi|lend|borrow|yield|farm|liquidity|pool|aave|uniswap/i.test(lower)) category = "defi";
  else if (/crypto|bitcoin|btc|eth|coin|hodl|moon|bull|bear|trade/i.test(lower)) category = "crypto";
  else if (/farcaster|warpcast|cast|frame|mini.?app|channel/i.test(lower)) category = "farcaster";
  else if (/meme|lol|funny|joke|humor|haha/i.test(lower)) category = "meme";
  else if (/help|what can you|menu|feature|how to/i.test(lower)) category = "help";
  else if (/meaning|life|exist|purpose|philosophy|why are we/i.test(lower)) category = "philosophy";

  const pool = responses[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const model = await getModel();
    if (model) {
      const { streamText } = await import("ai");
      const result = streamText({
        model,
        system: SYSTEM_PROMPT,
        messages,
        maxTokens: 500,
        temperature: 0.9,
      });
      return result.toDataStreamResponse();
    }

    await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
    const reply = localResponse(lastMessage);
    return Response.json({ role: "assistant", content: reply });
  } catch (error) {
    console.error("[mrxlolcat-agent] chat error:", error);
    return Response.json(
      { role: "assistant", content: "oops, cat brain crashed 😿 try again!" },
      { status: 500 }
    );
  }
}
