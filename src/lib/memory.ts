// Persistent chat memory using localStorage
// Survives page reloads and session restarts

const STORAGE_KEY = "mrxlolcat-agent:chat-history";
const MAX_MESSAGES = 200;

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function loadHistory(): StoredMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const messages: StoredMessage[] = JSON.parse(raw);
    return messages.slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

export function saveHistory(messages: StoredMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full — clear oldest half
    try {
      const trimmed = messages.slice(-Math.floor(MAX_MESSAGES / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch { /* silent */ }
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getMessageCount(): number {
  return loadHistory().length;
}
