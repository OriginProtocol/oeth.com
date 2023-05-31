interface Holding {
  ETH?: number;
  WETH?: number;
  RETH?: number;
  FRXETH?: number;
  STETH?: number;
}
interface Strategy {
  total: number;
  name: string;
  holdings: Holding;
  holdings_value: Holding;
  address: string;
  tvl?: number;
}

interface Strategies {
  oeth_vault_holding: Strategy;
  st_eth_strat: Strategy;
  r_eth_strat: Strategy;
  frax_eth_strat: Strategy;
  convexstrat_holding: Strategy;
  oeth_morpho_aave_strat: Strategy;
  [key: string]: Strategy;
}

export default Strategies;
