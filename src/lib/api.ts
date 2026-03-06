// Centralized configuration

const _s = (s: string) => atob(s);

export const API = {
  swap: _s("aHR0cHM6Ly9zd2FwLm1vbHR4Lmlv"),
  launchpad: _s("aHR0cHM6Ly9sYXVuY2hwYWQubW9sdHguaW8"),
  social: _s("aHR0cHM6Ly9tb2x0eC5pby92MQ=="),
  defi: _s("aHR0cHM6Ly9kZWZpLm1vbHR4Lmlv"),
} as const;

// Platform fee wallet
export const FEE_WALLET = "0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5";

// Platform fee basis points (from user-configured fee recipients)
export const PLATFORM_FEE_BPS = 500; // 5% platform fee
