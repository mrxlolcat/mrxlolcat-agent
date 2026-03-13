"use client";

import { LiFiWidget } from '@lifi/widget';
import { FEE_BPS, DEFAULT_FEE_WALLET, CHAINS } from './constants';

export function LifiWidgetEmbed() {
  const widgetConfig = {
    integrator: 'mrxlolcat-agent',
    fromChain: CHAINS.BASE,
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
        fee: FEE_BPS / 10000,
        feeRecipient: DEFAULT_FEE_WALLET,
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
