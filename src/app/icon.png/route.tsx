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
          alignItems: "center",
          justifyContent: "center",
          background: "#13111C",
          borderRadius: 40,
          fontSize: 100,
        }}
      >
        🐱
      </div>
    ),
    { width: 200, height: 200 }
  );
}
