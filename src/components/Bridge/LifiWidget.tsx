"use client";

import { LiFiWidget } from '@lifi/widget';
import { FEE_BPS, DEFAULT_FEE_WALLET, CHAINS } from '../../configs/constants';

export function LifiWidgetEmbed() {
  const widgetConfig = {
    integrator: 'mrxlolcat-agent',
    fromChain: CHAINS.BASE,
    theme: {
      palette: {
        primary: { main: '#00F0FF' },
        secondary: { main: '#175DDC' },
        background: { paper: '#0A0A0A', default: '#000000' },
        text: { primary: '#ffffff', secondary: '#888888' },
      },
      shape: {
        borderRadius: 12,
        borderRadiusSecondary: 8,
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
    appearance: 'dark',
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
      <LiFiWidget config={widgetConfig as Parameters<typeof LiFiWidget>[0]["config"]} integrator="mrxlolcat-agent" />
    </div>
  );
}
