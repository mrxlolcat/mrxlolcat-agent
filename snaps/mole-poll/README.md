# 🌮 Mole Poll Snap

A Farcaster Snap poll asking users to pick their favorite variety of mole.

## Mole Varieties

| Mole | Description |
|------|-------------|
| 🥑 Guacamole | Creamy avocado classic |
| 🍫 Mole Poblano | Rich chocolate-chile sauce |
| 🌿 Mole Verde | Fresh green herbs & pumpkin seeds |
| ⚫ Mole Negro | Dark, complex Oaxacan style |
| 🟡 Mole Amarillo | Yellow chile spice blend |
| 🍅 Salsa Verde | Tangy tomatillo sauce |

## Development

```bash
cd snaps/mole-poll
pnpm install
pnpm dev
```

## Local Testing

```bash
curl -s -H 'Accept: application/vnd.farcaster.snap+json' 'http://localhost:3003/'
```

## Deploy

Follow the farcaster-snap skill instructions to deploy to `host.neynar.app`.
