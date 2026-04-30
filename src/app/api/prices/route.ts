import { NextResponse } from "next/server";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

const TOKEN_IDS = [
  "ethereum",
  "bitcoin",
  "usd-coin",
  "tether",
  "binancecoin",
  "matic-network",
  "avalanche-2",
  "wrapped-bitcoin",
  "dai",
  "weth",
];

export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET() {
  try {
    const ids = TOKEN_IDS.join(",");
    const res = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prices", prices: getDefaultPrices() },
        { status: 200 }
      );
    }

    const data: Record<string, { usd: number; usd_24h_change?: number; usd_market_cap?: number }> = await res.json();

    const prices: Record<string, { price: number; change24h: number; marketCap: number }> = {};
    for (const [id, info] of Object.entries(data)) {
      prices[id] = {
        price: info.usd,
        change24h: info.usd_24h_change ?? 0,
        marketCap: info.usd_market_cap ?? 0,
      };
    }

    return NextResponse.json({ prices, timestamp: Date.now() });
  } catch {
    return NextResponse.json(
      { error: "Price fetch failed", prices: getDefaultPrices(), timestamp: Date.now() },
      { status: 200 }
    );
  }
}

function getDefaultPrices() {
  return {
    ethereum: { price: 0, change24h: 0, marketCap: 0 },
    bitcoin: { price: 0, change24h: 0, marketCap: 0 },
    "usd-coin": { price: 1, change24h: 0, marketCap: 0 },
    tether: { price: 1, change24h: 0, marketCap: 0 },
    binancecoin: { price: 0, change24h: 0, marketCap: 0 },
    "matic-network": { price: 0, change24h: 0, marketCap: 0 },
    "avalanche-2": { price: 0, change24h: 0, marketCap: 0 },
    "wrapped-bitcoin": { price: 0, change24h: 0, marketCap: 0 },
    dai: { price: 1, change24h: 0, marketCap: 0 },
    weth: { price: 0, change24h: 0, marketCap: 0 },
  };
}
