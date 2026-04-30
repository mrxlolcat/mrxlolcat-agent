import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import MiniApp from "../providers/MiniApp";

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
  title: "MRX LOLCAT Agent | On-Chain AI Automation",
  description: "Automate on-chain tasks using AI agents. Fast automation, AI-powered decision making, and secure wallet integration on Farcaster.",
  keywords: ["AI Agent", "Farcaster", "Crypto Automation", "Base", "On-chain", "MRX LOLCAT"],
  openGraph: {
    title: "MRX LOLCAT Agent | On-Chain AI Automation",
    description: "Automate on-chain tasks using AI agents. Secure, fast, and verified on Farcaster.",
    url: appUrl,
    siteName: "MRX LOLCAT Agent",
    images: [
      {
        url: `${appUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "MRX LOLCAT Agent Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MRX LOLCAT Agent | On-Chain AI Automation",
    description: "Automate on-chain tasks using AI agents. Secure and fast on Farcaster.",
    images: [`${appUrl}/og.png`],
  },
  other: {
    "fc:miniapp": JSON.stringify(miniAppEmbed),
    "talentapp:project_verification": "314f5e0c6ec0e0f4bafa4dbd3479528c1067eda4066e600deade59768b4c9f7c28603e7e390ead0de67f6c5d408dce81db3128005934d7b3a0b48207cf65321b",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" data-theme="dark">
      <body dir="ltr" className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <MiniApp>
          {children}
          <Analytics />
        </MiniApp>
        <script dangerouslySetInnerHTML={{ __html: `
          document.documentElement.setAttribute('dir', 'ltr');
          document.body.setAttribute('dir', 'ltr');
          document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') || 'dark');
        `}} />
      </body>
    </html>
  );
}
