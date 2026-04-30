// ─── Chain Configuration ─────────────────────────────────────────────────────

export const CHAINS = {
  BASE: 8453,
  ETHEREUM: 1,
  OPTIMISM: 10,
  ARBITRUM: 42161,
  POLYGON: 137,
  BSC: 56,
  AVALANCHE: 43114,
  ZKSYNC: 324,
  LINEA: 59144,
  SCROLL: 534352,
  BASE_SEPOLIA: 84532,
} as const;

export type ChainId = (typeof CHAINS)[keyof typeof CHAINS];

export interface ChainMeta {
  id: ChainId;
  name: string;
  shortName: string;
  nativeCurrency: string;
  rpcUrl: string;
  explorerUrl: string;
  logoUrl: string;
  color: string;
}

export const CHAIN_META: Record<number, ChainMeta> = {
  [CHAINS.BASE]: {
    id: CHAINS.BASE,
    name: "Base",
    shortName: "BASE",
    nativeCurrency: "ETH",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://base.blockscout.com",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
    color: "#0052FF",
  },
  [CHAINS.ETHEREUM]: {
    id: CHAINS.ETHEREUM,
    name: "Ethereum",
    shortName: "ETH",
    nativeCurrency: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    color: "#627EEA",
  },
  [CHAINS.OPTIMISM]: {
    id: CHAINS.OPTIMISM,
    name: "Optimism",
    shortName: "OP",
    nativeCurrency: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
    color: "#FF0420",
  },
  [CHAINS.ARBITRUM]: {
    id: CHAINS.ARBITRUM,
    name: "Arbitrum",
    shortName: "ARB",
    nativeCurrency: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
    color: "#28A0F0",
  },
  [CHAINS.POLYGON]: {
    id: CHAINS.POLYGON,
    name: "Polygon",
    shortName: "MATIC",
    nativeCurrency: "POL",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    color: "#8247E5",
  },
  [CHAINS.BSC]: {
    id: CHAINS.BSC,
    name: "BNB Chain",
    shortName: "BSC",
    nativeCurrency: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
    color: "#F0B90B",
  },
  [CHAINS.AVALANCHE]: {
    id: CHAINS.AVALANCHE,
    name: "Avalanche",
    shortName: "AVAX",
    nativeCurrency: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowscan.xyz",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
    color: "#E84142",
  },
  [CHAINS.ZKSYNC]: {
    id: CHAINS.ZKSYNC,
    name: "zkSync Era",
    shortName: "zkSync",
    nativeCurrency: "ETH",
    rpcUrl: "https://mainnet.era.zksync.io",
    explorerUrl: "https://era.zksync.network",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zksync/info/logo.png",
    color: "#8C8DFC",
  },
  [CHAINS.LINEA]: {
    id: CHAINS.LINEA,
    name: "Linea",
    shortName: "LINEA",
    nativeCurrency: "ETH",
    rpcUrl: "https://rpc.linea.build",
    explorerUrl: "https://lineascan.build",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png",
    color: "#121212",
  },
  [CHAINS.SCROLL]: {
    id: CHAINS.SCROLL,
    name: "Scroll",
    shortName: "SCROLL",
    nativeCurrency: "ETH",
    rpcUrl: "https://rpc.scroll.io",
    explorerUrl: "https://scrollscan.com",
    logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png",
    color: "#FFEEDA",
  },
};

// ─── Token Configuration ─────────────────────────────────────────────────────

export interface TokenMeta {
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  addresses: Partial<Record<number, string>>;
  coingeckoId: string;
}

export const POPULAR_TOKENS: TokenMeta[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    coingeckoId: "ethereum",
    addresses: {
      [CHAINS.BASE]: "0x0000000000000000000000000000000000000000",
      [CHAINS.ETHEREUM]: "0x0000000000000000000000000000000000000000",
      [CHAINS.OPTIMISM]: "0x0000000000000000000000000000000000000000",
      [CHAINS.ARBITRUM]: "0x0000000000000000000000000000000000000000",
      [CHAINS.ZKSYNC]: "0x0000000000000000000000000000000000000000",
      [CHAINS.LINEA]: "0x0000000000000000000000000000000000000000",
      [CHAINS.SCROLL]: "0x0000000000000000000000000000000000000000",
    },
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
    coingeckoId: "usd-coin",
    addresses: {
      [CHAINS.BASE]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      [CHAINS.ETHEREUM]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      [CHAINS.OPTIMISM]: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      [CHAINS.ARBITRUM]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      [CHAINS.POLYGON]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      [CHAINS.BSC]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      [CHAINS.AVALANCHE]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    },
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    coingeckoId: "tether",
    addresses: {
      [CHAINS.ETHEREUM]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      [CHAINS.OPTIMISM]: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      [CHAINS.ARBITRUM]: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      [CHAINS.POLYGON]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      [CHAINS.BSC]: "0x55d398326f99059fF775485246999027B3197955",
      [CHAINS.AVALANCHE]: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    },
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    logoUrl: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
    coingeckoId: "wrapped-bitcoin",
    addresses: {
      [CHAINS.BASE]: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
      [CHAINS.ETHEREUM]: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      [CHAINS.OPTIMISM]: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      [CHAINS.ARBITRUM]: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      [CHAINS.POLYGON]: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    },
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
    coingeckoId: "dai",
    addresses: {
      [CHAINS.BASE]: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      [CHAINS.ETHEREUM]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      [CHAINS.OPTIMISM]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      [CHAINS.ARBITRUM]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      [CHAINS.POLYGON]: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
    coingeckoId: "weth",
    addresses: {
      [CHAINS.BASE]: "0x4200000000000000000000000000000000000006",
      [CHAINS.ETHEREUM]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      [CHAINS.OPTIMISM]: "0x4200000000000000000000000000000000000006",
      [CHAINS.ARBITRUM]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      [CHAINS.POLYGON]: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      [CHAINS.BSC]: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      [CHAINS.AVALANCHE]: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    },
  },
  {
    symbol: "BNB",
    name: "BNB",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    coingeckoId: "binancecoin",
    addresses: {
      [CHAINS.BSC]: "0x0000000000000000000000000000000000000000",
    },
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
    coingeckoId: "avalanche-2",
    addresses: {
      [CHAINS.AVALANCHE]: "0x0000000000000000000000000000000000000000",
    },
  },
  {
    symbol: "POL",
    name: "Polygon",
    decimals: 18,
    logoUrl: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
    coingeckoId: "matic-network",
    addresses: {
      [CHAINS.POLYGON]: "0x0000000000000000000000000000000000000000",
    },
  },
];

// Legacy token address mapping (backward compat)
export const TOKENS = {
  USDC_BASE: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  ETH_BASE: "0x0000000000000000000000000000000000000000",
  USDC_OP: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  ETH_OP: "0x0000000000000000000000000000000000000000",
  USDC_ETH: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  ETH_ETH: "0x0000000000000000000000000000000000000000",
};

export const FEE_BPS = 10; // 0.1% platform fee
export const DEFAULT_FEE_WALLET = "0xbA444Be47ac0Fb4738C6fcb33D19Bc03E854B4B5";

// ─── Base-Specific Contracts ─────────────────────────────────────────────────

export const BASE_CONTRACTS = {
  WETH9: "0x4200000000000000000000000000000000000006",
  L2StandardBridge: "0x4200000000000000000000000000000000000010",
  GasPriceOracle: "0x420000000000000000000000000000000000000F",
  L1Block: "0x4200000000000000000000000000000000000015",
};
