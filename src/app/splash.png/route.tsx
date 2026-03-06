import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#13111C",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 80 }}>🐱</span>
        <span style={{ fontSize: 12, color: "#8B5CF6", fontWeight: 700 }}>
          mrxlolcat-agent
        </span>
      </div>
    ),
    { width: 200, height: 200 }
  );
}
