const strategyMapping: {
  [key: string]: {
    protocol: string;
    name: string;
    short_name: string;
    address: string;
    vault?: boolean;
    icon?: string;
    icons?: { [key: string]: string };
    tokens: string[];
  };
} = {
  vault_holding: {
    protocol: "Vault",
    short_name: "Origin Vault",
    name: "Origin Vault",
    address: "0x39254033945AA2E4809Cc2977E7087BEE48bd7Ab",
    vault: true,
    icons: {
      WETH: "/images/weth-icon.svg",
      FRXETH: "/images/frax-icon.svg",
    },
    tokens: ["weth", "frxeth", "steth", "reth"],
  },
  r_eth_strat: {
    protocol: "RocketPool",
    short_name: "Rocket Pool Ethereum Staking",
    name: "Rocket Pool Ether (rETH)",
    address: "0xDD3f50F8A6CafbE9b31a427582963f465E745AF8",
    icon: "/images/rocketpool-icon.png",
    tokens: ["reth"],
  },
  st_eth_strat: {
    protocol: "Lido",
    short_name: "Lido Ethereum Staking",
    name: "Lido Staked Ether (stETH)",
    address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    icon: "/images/lido-icon.svg",
    tokens: ["steth"],
  },
  convexstrat_holding: {
    protocol: "Convex",
    short_name: "",
    name: "Convex ETH + Rocket Pool Ether (rETH)",
    address: "0x5e3646A1Db86993f73E6b74A57D8640B69F7e259",
    icon: "/images/convex-reth.svg",
    tokens: ["reth", "weth"],
  },
  frax_eth_strat: {
    protocol: "Frax",
    short_name: "Frax Ethereum Staking",
    name: "Staked Frax Ether (sfrxETH)",
    address: "0xac3E018457B222d93114458476f3E3416Abbe38F",
    icon: "/images/sfrax-icon.svg",
    tokens: ["frxeth"],
  },
  oeth_curve_amo: {
    protocol: "Convex",
    short_name: "Convex OETH",
    name: "Convex ETH+OETH",
    address: "0x1827F9eA98E0bf96550b2FC20F7233277FcD7E63",
    icon: "/images/convex-oeth.svg",
    tokens: ["oeth", "eth"],
  },
};

export default strategyMapping;
