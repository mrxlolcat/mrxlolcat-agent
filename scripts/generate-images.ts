// Run: npx tsx scripts/generate-images.ts
// Generates icon.png (200x200), splash.png (200x200), og.png (1200x800)
// Uses SVG → PNG conversion via sharp (install: npm i -D sharp)

import fs from "fs";
import path from "path";

const PUBLIC = path.join(process.cwd(), "public");

// Icon SVG (200x200)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6"/>
      <stop offset="50%" style="stop-color:#EC4899"/>
      <stop offset="100%" style="stop-color:#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="#13111C"/>
  <circle cx="100" cy="105" r="65" fill="url(#g)" opacity="0.2"/>
  <text x="100" y="120" text-anchor="middle" font-size="72">🐱</text>
</svg>`;

// Splash SVG (200x200)
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#13111C"/>
  <text x="100" y="110" text-anchor="middle" font-size="72">🐱</text>
  <text x="100" y="150" text-anchor="middle" font-size="11" fill="#8B5CF6" font-family="sans-serif" font-weight="bold">mrxlolcat-agent</text>
</svg>`;

// OG Image SVG (1200x800 = 3:2 ratio)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#13111C"/>
      <stop offset="50%" style="stop-color:#1E1B2E"/>
      <stop offset="100%" style="stop-color:#13111C"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8B5CF6"/>
      <stop offset="50%" style="stop-color:#EC4899"/>
      <stop offset="100%" style="stop-color:#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <circle cx="600" cy="320" r="120" fill="url(#accent)" opacity="0.15"/>
  <text x="600" y="340" text-anchor="middle" font-size="140">🐱</text>
  <text x="600" y="480" text-anchor="middle" font-size="52" fill="white" font-family="system-ui, sans-serif" font-weight="800">mrxlolcat-agent</text>
  <text x="600" y="530" text-anchor="middle" font-size="22" fill="#A0A0B8" font-family="system-ui, sans-serif">AI Agent · Swap · Launchpad · Social · Lending</text>
  <rect x="350" y="570" width="500" height="3" rx="1.5" fill="url(#accent)" opacity="0.5"/>
  <text x="600" y="620" text-anchor="middle" font-size="16" fill="#666" font-family="system-ui, sans-serif">Farcaster Mini App</text>
</svg>`;

// Write SVGs as fallback (can be converted to PNG with sharp)
fs.writeFileSync(path.join(PUBLIC, "icon.svg"), iconSvg);
fs.writeFileSync(path.join(PUBLIC, "splash.svg"), splashSvg);
fs.writeFileSync(path.join(PUBLIC, "og.svg"), ogSvg);

console.log("SVGs written to public/");
console.log("To convert to PNG, install sharp and run conversion.");
console.log("Or use an online SVG→PNG converter for icon.png, splash.png, og.png");
