import { Hono } from "hono";
import { SPEC_VERSION, type SnapFunction } from "@farcaster/snap";
import { registerSnapHandler } from "@farcaster/snap-hono";

// Mole varieties for the poll
const MOLE_VARIETIES = [
  { id: "guacamole", label: "🥑 Guacamole", description: "Creamy avocado classic" },
  { id: "mole-poblano", label: "🍫 Mole Poblano", description: "Rich chocolate-chile sauce" },
  { id: "mole-verde", label: "🌿 Mole Verde", description: "Fresh green herbs & pumpkin seeds" },
  { id: "mole-negro", label: "⚫ Mole Negro", description: "Dark, complex Oaxacan style" },
  { id: "mole-amarillo", label: "🟡 Mole Amarillo", description: "Yellow chile spice blend" },
  { id: "salsa-verde", label: "🍅 Salsa Verde", description: "Tangy tomatillo sauce" },
] as const;

const POLL_NAME = "mole_vote";

// In-memory vote storage (for demo - use Turso in production)
const votes = new Map<string, number>();
MOLE_VARIETIES.forEach((m) => votes.set(m.id, 0));

function getTotalVotes(): number {
  let total = 0;
  votes.forEach((v) => (total += v));
  return total;
}

function getBarWidth(voteId: string): number {
  const total = getTotalVotes();
  if (total === 0) return 0;
  return Math.round(((votes.get(voteId) || 0) / total) * 100);
}

const snap: SnapFunction = async (ctx) => {
  const isPost = ctx.action.type === "post";
  const userVote = isPost && "inputs" in ctx.action
    ? (ctx.action.inputs[POLL_NAME] as string | undefined)
    : undefined;

  // Record vote if submitted
  if (userVote && votes.has(userVote)) {
    votes.set(userVote, (votes.get(userVote) || 0) + 1);
  }

  const total = getTotalVotes();
  const base = snapBaseUrlFromRequest(ctx.request);

  // Build bar_chart data for results
  const barData = MOLE_VARIETIES.map((m) => ({
    label: m.label.split(" ")[1] || m.label,
    value: getBarWidth(m.id),
  }));

  return {
    version: SPEC_VERSION,
    theme: { accent: "amber" },
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: [
            "header",
            "question",
            ...(userVote ? ["results_title", "results"] : ["poll_options"]),
            "footer",
            ...(userVote ? [] : ["submit_btn"]),
          ],
        },
        header: {
          type: "item",
          props: {
            title: "🌮 Mole Poll",
            description: userVote
              ? `Thanks for voting! ${total} total votes`
              : "Pick your favorite Mexican sauce!",
          },
        },
        question: {
          type: "text",
          props: {
            text: "Which mole variety is your favorite?",
            weight: "bold",
          },
        },
        // Show poll options (toggle_group) when not yet voted
        poll_options: {
          type: "toggle_group",
          props: {
            name: POLL_NAME,
            options: MOLE_VARIETIES.map((m) => m.id),
            labels: MOLE_VARIETIES.map((m) => m.label),
          },
        },
        // Show results (bar_chart) after voting
        results_title: {
          type: "text",
          props: {
            text: `📊 Results (${total} votes)`,
            weight: "bold",
          },
        },
        results: {
          type: "bar_chart",
          props: {
            data: barData,
          },
        },
        footer: {
          type: "badge",
          props: {
            label: userVote
              ? `You voted: ${
                  MOLE_VARIETIES.find((m) => m.id === userVote)?.label.split(" ")[1]
                }`
              : "Tap to select, then Submit",
          },
        },
        submit_btn: {
          type: "button",
          props: {
            label: "Submit Vote",
            variant: "primary",
          },
          on: {
            press: {
              action: "submit",
              params: { target: `${base}/` },
            },
          },
        },
      },
    },
  };
};

const app = new Hono();

registerSnapHandler(app, snap, {
  openGraph: {
    title: "Mole Poll",
    description: "Vote for your favorite variety of mole!",
  },
});

export default app;

function snapBaseUrlFromRequest(request: Request): string {
  const fromEnv = process.env.SNAP_PUBLIC_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = request.headers.get("host");
  const host = (forwardedHost ?? hostHeader)?.split(",")[0].trim();
  const isLoopback =
    host !== undefined &&
    /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/.test(host);
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto
    ? forwardedProto.split(",")[0].trim().toLowerCase()
    : isLoopback
      ? "http"
      : "https";
  if (host) return `${proto}://${host}`.replace(/\/$/, "");

  return `http://localhost:${process.env.PORT ?? "3003"}`.replace(/\/$/, "");
}
