"use client";

import { LiFiWidget } from '@lifi/widget';

export function LifiWidgetEmbed() {
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
    // Fees in the widget are properly handled via sdkConfig in newer versions
    sdkConfig: {
      routeOptions: {
        fee: 0.001, // 0.1% platform fee
        feeRecipient: '0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5',
      },
    },
    buildUrl: true,
  };

  return (
    <div className="flex justify-center w-full mt-4">
      <LiFiWidget config={widgetConfig as any} integrator="mrxlolcat-agent" />
    </div>
  );
}
