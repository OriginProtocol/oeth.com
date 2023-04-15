const strategyMapping = {
  vault_holding: {
    protocol: "Vault",
    name: "Origin Vault",
    address: "0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70",
    dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    usdt: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  threepoolstrat_holding: {
    protocol: "Convex",
    name: "Convex DAI+USDC+USDT",
    address: "0xEA2Ef2e2E5A749D4A66b41Db9aD85a38Aa264cb3",
    icon: "/images/tokens/convex-3pool.svg",
  },
  ousd_metastrat: {
    protocol: "Convex",
    name: "Convex OUSD+3Crv",
    address: "0x7a192dd9cc4ea9bdedec9992df74f1da55e60a19",
    icon: "/images/tokens/convex-meta.svg",
  },
  lusd_metastrat: {
    protocol: "Convex",
    name: "Convex LUSD+3Crv",
    address: "0x7a192dd9cc4ea9bdedec9992df74f1da55e60a19",
    icon: "/images/tokens/convex-lusd.svg",
  },
  morpho_strat: {
    protocol: "Morpho",
    singleAsset: true,
    name: "Morpho Compound",
    address: "0x5A4eEe58744D1430876d5cA93cAB5CcB763C037D",
  },
  morpho_aave_strat: {
    protocol: "Morpho",
    singleAsset: true,
    name: "Morpho Aave",
    address: "0x79f2188ef9350a1dc11a062cca0abe90684b0197",
  },
  aavestrat_holding: {
    protocol: "Aave",
    singleAsset: true,
    name: "Aave",
    address: "0x5e3646A1Db86993f73E6b74A57D8640B69F7e259",
    dai: "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d",
    usdc: "0xe87ba1bd11ee6e0d3c7dd6932e6a038e38627f65",
    usdt: "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8",
  },
  compstrat_holding: {
    protocol: "Compound",
    singleAsset: true,
    name: "Compound",
    address: "0x9c459eeb3FA179a40329b81C1635525e9A0Ef094",
    dai: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
    usdc: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
    usdt: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
  },
};

export default strategyMapping;
