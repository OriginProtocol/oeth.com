interface Strategy {
  total: number;
  name: string;
  holdings: {
    ETH?: number;
    WETH?: number;
    RETH?: number;
    FRXETH?: number;
    STETH?: number;
  };
  address: string;
}

interface Strategies {
  oeth_vault_holding: Strategy;
  st_eth_strat: Strategy;
  r_eth_strat: Strategy;
  frax_eth_strat: Strategy;
  convexstrat_holding: Strategy;
  [key: string]: Strategy;
}

export default Strategies;
