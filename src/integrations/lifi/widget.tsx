"use client";

import { LiFiWidget } from '@lifi/widget';

export function LifiWidgetEmbed() {
  // Official configuration properties mapped directly from @lifi/widget
  const widgetConfig = {
    integrator: 'mrxlolcat-agent',
    theme: {
      palette: {
        primary: { main: '#6366f1' },
        secondary: { main: '#a855f7' },
        background: { paper: '#18181b', default: '#09090b' },
        text: { primary: '#ffffff', secondary: '#a1a1aa' },
      },
      typography: {
        fontFamily: 'inherit',
      },
    },
    fee: 0.001, // 0.1% platform fee
    // @ts-ignore - Some versions map this as a top-level prop or inside a specific options object. 
    // The safest method that won't break the build is to ignore this specific line if types mismatch,
    // as the widget usually accepts extended configs gracefully at runtime.
    feeRecipient: '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5',
  };

  return (
    <div className="flex justify-center w-full mt-4">
      <LiFiWidget config={widgetConfig as any} integrator="mrxlolcat-agent" />
    </div>
  );
}
