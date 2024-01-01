import { uniq } from "lodash";

export interface StrategyInfo {
  path: string;
  address: string;
  protocol: string;
  name: string;
  asset: string;
  assetName: string;
}

// Field `asset` only relevant for Vault strategies.
export const strategies: StrategyInfo[] = [
  {
    path: "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
    address: "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
    protocol: "Frax",
    name: "Staked Frax Ether",
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Frax ETH (frxETH)",
  },
  {
    path: "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63",
    address: "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63",
    protocol: "Convex",
    name: "Convex ETH+OETH Curve pool",
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Convex ETH+OETH Curve pool (ETH+OETH)",
  },
  {
    path: "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc",
    address: "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc",
    protocol: "Aura",
    name: "Aura WETH+rETH Balancer pool",
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Aura WETH+rETH Balancer pool (WETH+rETH)",
  },
  {
    path: "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    address: "0x39254033945aa2e4809cc2977e7087bee48bd7ab",
    protocol: "Lido",
    name: "Lido Staked Ether",
    asset: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    assetName: "Lido Staked Ether (stETH)",
  },
  {
    path: "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae78736cd615f374d3085123a210448e74fc6393",
    address: "0x39254033945aa2e4809cc2977e7087bee48bd7ab",
    protocol: "Rocket Pool",
    name: "Rocket Pool ETH",
    asset: "0xae78736cd615f374d3085123a210448e74fc6393",
    assetName: "Rocket Pool ETH (rETH)",
  },
  {
    path: "0xc1fc9e5ec3058921ea5025d703cbe31764756319",
    address: "0xc1fc9e5ec3058921ea5025d703cbe31764756319",
    protocol: "Aave",
    name: "Aave V2 Optimizer WETH",
    asset: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    assetName: "Wrapped Ether (WETH)",
  },
];

export const strategyAddresses = uniq(strategies.map((s) => s.address));
