import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 800,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #13111C 0%, #1E1B2E 50%, #13111C 100%)",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 140 }}>🐱</span>
        <span
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            marginTop: 16,
          }}
        >
          mrxlolcat-agent
        </span>
        <span style={{ fontSize: 22, color: "#A0A0B8" }}>
          AI Agent · Swap · Launchpad · Social · Lending
        </span>
        <div
          style={{
            width: 400,
            height: 3,
            background: "linear-gradient(90deg, #8B5CF6, #EC4899, #06B6D4)",
            borderRadius: 2,
            marginTop: 24,
          }}
        />
        <span style={{ fontSize: 16, color: "#666", marginTop: 12 }}>
          Farcaster Mini App
        </span>
      </div>
    ),
    { width: 1200, height: 800 }
  );
}
