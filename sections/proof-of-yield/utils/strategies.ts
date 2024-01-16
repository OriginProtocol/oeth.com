import { uniq } from "lodash";
import protocolMapping from "../../../constants/protocolMapping";

export interface StrategyInfo {
  key: string;
  path: string;
  address: string;
  protocol: string;
  protocolHref: string; // Link to protocol website
  name: string;
  yieldDescription?: string;
  asset: string;
  assetName: string;
  assetSymbol: string;
  assetHref: string; // Link to asset contract
  icons: string[];
}

// Field `asset` only relevant for Vault strategies.
export const strategies: StrategyInfo[] = [
  {
    key: "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5+0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    path: "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
    address: "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
    protocol: "Frax",
    protocolHref: "https://frax.finance/",
    name: "Staked Frax Ether",
    yieldDescription: protocolMapping.Frax.description,
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Frax ETH",
    assetSymbol: "frxETH",
    assetHref:
      "https://etherscan.io/token/0x5e8422345238f34275888049021821e8e08caa1f",
    icons: ["/images/sfrax-icon.svg"],
  },
  {
    key: "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63+0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    path: "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63",
    address: "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63",
    protocol: "Convex",
    protocolHref: "https://www.convexfinance.com/",
    name: "Convex ETH+OETH Curve pool",
    yieldDescription: protocolMapping.Convex.description,
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Ether",
    assetSymbol: "ETH",
    assetHref:
      "https://etherscan.io/address/0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
    icons: ["/images/eth-icon.svg", "/images/oeth-icon.svg"],
  },
  {
    key: "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc+0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    path: "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc",
    address: "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc",
    protocol: "Aura",
    protocolHref: "https://aura.finance/",
    name: "Aura WETH+rETH Balancer pool",
    yieldDescription: protocolMapping.Aura.description,
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Rocket Pool ETH",
    assetSymbol: "WETH+rETH",
    assetHref:
      "https://etherscan.io/address/0x1e19cf2d73a72ef1332c882f20534b6519be0276",
    icons: ["/images/weth-icon.svg", "/images/reth-icon.png"],
  },
  {
    key: "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    path: "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    address: "0x39254033945aa2e4809cc2977e7087bee48bd7ab",
    protocol: "Lido",
    protocolHref: "https://lido.fi/",
    name: "Lido Staked Ether",
    yieldDescription: protocolMapping.Lido.description,
    asset: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    assetName: "Lido Staked Ether",
    assetSymbol: "stETH",
    assetHref:
      "https://etherscan.io/token/0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    icons: ["/images/lido-icon.svg"],
  },
  {
    key: "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae78736cd615f374d3085123a210448e74fc6393",
    path: "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae78736cd615f374d3085123a210448e74fc6393",
    address: "0x39254033945aa2e4809cc2977e7087bee48bd7ab",
    protocol: "Rocket Pool",
    protocolHref: "https://rocketpool.net/",
    name: "Rocket Pool ETH",
    yieldDescription: protocolMapping.RocketPool.description,
    asset: "0xae78736cd615f374d3085123a210448e74fc6393",
    assetName: "Rocket Pool ETH",
    assetSymbol: "rETH",
    assetHref:
      "https://etherscan.io/token/0xae78736cd615f374d3085123a210448e74fc6393",
    icons: ["/images/reth-icon.svg"],
  },
  {
    key: "0xc1fc9e5ec3058921ea5025d703cbe31764756319+0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    path: "0xc1fc9e5ec3058921ea5025d703cbe31764756319",
    address: "0xc1fc9e5ec3058921ea5025d703cbe31764756319",
    protocol: "Aave",
    protocolHref: "https://aave.com/",
    name: "Aave V2 Optimizer WETH",
    yieldDescription: protocolMapping.Morpho.description,
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Wrapped Ether",
    assetSymbol: "WETH",
    assetHref:
      "https://etherscan.io/token/0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
    icons: ["/images/weth-icon.svg"],
  },
];

export const strategyAddresses = uniq(strategies.map((s) => s.address));
