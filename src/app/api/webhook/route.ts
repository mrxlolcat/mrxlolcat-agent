import { NextRequest, NextResponse } from "next/server";
import {
  storeNotificationToken,
  removeNotificationToken,
} from "~/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = JSON.parse(
      Buffer.from(body.payload, "base64url").toString()
    );

    const fid = payload.fid?.toString() || "unknown";

    switch (payload.event) {
      case "miniapp_added":
        if (payload.notificationDetails) {
          storeNotificationToken(
            fid,
            payload.notificationDetails.url,
            payload.notificationDetails.token
          );
        }
        console.log(`[mrxlolcat-agent] user ${fid} added the app`);
        break;

      case "miniapp_removed":
        removeNotificationToken(fid);
        console.log(`[mrxlolcat-agent] user ${fid} removed the app`);
        break;

      case "notifications_enabled":
        if (payload.notificationDetails) {
          storeNotificationToken(
            fid,
            payload.notificationDetails.url,
            payload.notificationDetails.token
          );
        }
        console.log(`[mrxlolcat-agent] user ${fid} enabled notifications`);
        break;

      case "notifications_disabled":
        removeNotificationToken(fid);
        console.log(`[mrxlolcat-agent] user ${fid} disabled notifications`);
        break;

      default:
        console.log(`[mrxlolcat-agent] unknown event: ${payload.event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[mrxlolcat-agent] webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
