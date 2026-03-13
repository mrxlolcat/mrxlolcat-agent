"use client";

import { LiFiWidget, WidgetConfig } from '@lifi/widget';

export function LifiWidgetEmbed() {
  const widgetConfig: any = {
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
    fee: 0.01, // 1% fee
    feeRecipient: '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5', // Fee wallet
  };

  return (
    <div className="flex justify-center w-full mt-4">
      <LiFiWidget config={widgetConfig} integrator="mrxlolcat-agent" />
    </div>
  );
}
