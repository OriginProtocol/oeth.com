const protocolMapping = {
  Convex: {
    color: "#ff5a5a",
    image: "/images/convex-strategy.svg",
    description:
      "Convex allows liquidity providers and stakers to earn greater rewards from Curve, a stablecoin-centric automated market maker (AMM). OETH earns trading fees and protocol token incentives (both CRV and CVX). This strategy serves as an algorithmic market operations controller (AMO), which enables OETH to safely leverage its own deposits to multiply returns and maintain the pool's balance.",
  },
  Lido: {
    color: "#66c8ff",
    image: "/images/lido-strategy.svg",
    description:
      "Lido is a liquid staking solution for Ethereum that staking ETH without locking tokens or maintaining infrastructure. OETH holds stETH to earn staking rewards for participating in the Ethereum network and adds a layer of auto-compounding.",
  },
  RocketPool: {
    color: "#e4ae89",
    image: "/images/rocketpool-strategy.svg",
    description:
      "Rocket Pool is a community-owned, decentralized protocol that mints rETH, an interest-earning ETH wrapper. OETH holds rETH to earn yield and normalizes the accounting by distributing additional tokens directly to users' wallets.",
  },
  Frax: {
    color: "#e85bff",
    image: "/images/frax-strategy.svg",
    description:
      "Frax uses a two-token model to maximize yields earned from staking validators. OETH deposits frxETH to the Frax Ether staking contract and amplifies this yield further.",
  },
  Vault: {
    color: "#8c66fc",
    description:
      "When OETH is minted, collateral is deposited into the Origin Vault and held until the allocate function is called. This happens automatically for larger transactions, which are less impacted by increased gas costs.",
  },
  Morpho: {
    color: "#9bc3e9",
    image: "/images/morpho-strategy.svg",
    description:
      "Morpho adds a peer-to-peer layer on top of Compound and Aave allowing lenders and borrowers to be matched more efficiently with better interest rates. When no matching opportunity exists, funds flow directly through to the underlying protocol. OETH supplies WETH to Morpho’s Aave V2 market to earn interest. Additional value is generated from protocol MORPHO token emissions (currently locked).",
  },
};

export default protocolMapping;
