import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import AppKitProvider from "@/context";
import { Analytics } from "@vercel/analytics/react";
import MiniApp from "../base/MiniApp";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mrxlolcat-agent.vercel.app";

const miniAppEmbed = {
  version: "1",
  imageUrl: `${appUrl}/og.png`,
  button: {
    title: "Launch mrxlolcat-agent",
    action: {
      type: "launch_frame",
      name: "mrxlolcat-agent",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#13111C",
    },
  },
};

export const metadata: Metadata = {
  title: "mrxlolcat-agent",
  description: "AI agent with token swap, launchpad, social feed, and DeFi lending — built on Farcaster.",
  openGraph: {
    title: "mrxlolcat-agent",
    description: "AI agent with token swap, launchpad, social feed, and DeFi lending.",
    images: [`${appUrl}/og.png`],
  },
  other: {
    "fc:miniapp": JSON.stringify(miniAppEmbed),
    "talentapp:project_verification": "314f5e0c6ec0e0f4bafa4dbd3479528c1067eda4066e600deade59768b4c9f7c28603e7e390ead0de67f6c5d408dce81db3128005934d7b3a0b48207cf65321b",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className="antialiased">
        <AppKitProvider cookies={cookies}>
          <MiniApp>
            {children}
            <Analytics />
          </MiniApp>
        </AppKitProvider>
      </body>
    </html>
  );
}
