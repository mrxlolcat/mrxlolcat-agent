import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warden: {
          bg: "#000000",
          surface: "#050505",
          border: "#111111",
          accent: "#00F0FF",
          gold: "#D4AF37",
          silver: "#C0C0C0",
          muted: "#444444",
        },
        cat: {
          purple: "#8B5CF6",
          pink: "#EC4899",
          cyan: "#06B6D4",
          dark: "#0A0A0A",
          darker: "#000000",
          surface: "#0F0F0F",
        },
      },
      boxShadow: {
        'premium': '0 0 50px -12px rgba(0, 240, 255, 0.25)',
        'gold-glow': '0 0 30px -5px rgba(212, 175, 55, 0.3)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F9D71C 50%, #D4AF37 100%)',
      },
      animation: {
        "gradient": "gradient 3s ease infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
