// Farcaster push notification sender
// Used server-side to send notifications to users who enabled them

interface NotificationPayload {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
}

const FARCASTER_NOTIFICATION_URL = "https://api.farcaster.xyz/v1/send-notification";

export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    const res = await fetch(FARCASTER_NOTIFICATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Notification storage — in production, use a database
// This is a minimal in-memory store for demo purposes
const notificationTokens = new Map<string, { url: string; token: string }>();

export function storeNotificationToken(fid: string, url: string, token: string) {
  notificationTokens.set(fid, { url, token });
}

export function removeNotificationToken(fid: string) {
  notificationTokens.delete(fid);
}

export function getNotificationToken(fid: string) {
  return notificationTokens.get(fid);
}

export function getAllTokens(): Array<{ fid: string; url: string; token: string }> {
  return Array.from(notificationTokens.entries()).map(([fid, data]) => ({
    fid,
    ...data,
  }));
}
