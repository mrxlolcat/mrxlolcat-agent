import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import AppKitProvider from "@/context";
import { Analytics } from "@vercel/analytics/react";

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
          {children}
          <Analytics />
        </AppKitProvider>
      </body>
    </html>
  );
}
