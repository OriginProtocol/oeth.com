const protocolMapping = {
  Convex: {
    image: "/images/convex-strategy.svg",
    description:
      "Convex allows liquidity providers and stakers to earn greater rewards from Curve, a stablecoin-centric automated market maker (AMM). OETH earns trading fees and protocol token incentives (both CRV and CVX). This strategy serves as an algorithmic market operations controller (AMO), which enables OETH to safely leverage its own deposits to multiply returns and maintain the pool's balance.",
  },
  Lido: {
    image: "/images/lido-strategy.svg",
    description:
      "Lido is a liquid staking solution for Ethereum that staking ETH without locking tokens or maintaining infrastructure. OETH holds stETH to earn staking rewards for participating in the Ethereum network and adds a layer of auto-compounding.",
  },
  RocketPool: {
    image: "/images/rocketpool-strategy.png",
    description:
      "Rocket Pool is a community-owned, decentralized protocol that mints rETH, an interest-earning ETH wrapper. OETH holds rETH to earn yield and normalizes the accounting by distributing additional tokens directly to users' wallets.",
  },
  Frax: {
    image: "/images/frax-strategy.svg",
    description:
      "Frax uses a two-token model to maximize yields earned from staking validators. OETH deposits frxETH to the Frax Ether staking contract and amplifies this yield further.",
  },
};

export default protocolMapping;
