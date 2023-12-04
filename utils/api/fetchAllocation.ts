import { formatEther, formatUnits } from "viem";

interface Holding {
  name: string;
  address?: string;
  _address?: string;
  icon_file?: string;
  total: number;
  tvl?: number;
  holdings: Record<string, number>;
  holdings_value: Record<string, number>;
}

interface Allocation {
  block_time: number;
  block_number: number;
  strategies: {
    vault_holding: Holding;
    frax_eth_strat: Holding;
    oeth_curve_amo: Holding;
    oeth_morpho_aave_strat: Holding;
    oeth_balancer_reth_strat: Holding;
    r_eth_strat?: Holding;
    st_eth_strat?: Holding;
  };
  total_value: number;
  total_value_usd: number;
  eth_price: number;
  total_supply: number;
  circulating_supply: number;
  protocol_owned_supply: number;
  revenue_all_time: number;
}

async function fetchAllocation() {
  const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query Collateral {
          oethDailyStats(orderBy: blockNumber_DESC, limit: 1) {
            id
            blockNumber
            timestamp
            totalSupply
            amoSupply
            revenueAllTime
            strategies {
              id
              total
              tvl
              holdings {
                symbol
                amount
                value
              }
            }
          }
          exchangeRates(limit: 1, orderBy: timestamp_DESC, where: {pair_eq: "ETH_USD"}) {
            rate
            timestamp
          }
        }`,
      variables: null,
      operationName: "Collateral",
    }),
  });
  const json = await res.json();

  function holdings(symbol) {
    const strategy = json.data.oethDailyStats[0].strategies.find((s) =>
      s.id.endsWith(symbol),
    );

    function getSymbol(holding) {
      if (holding.symbol === "SFRXETH") return "FRXETH";
      return holding.symbol;
    }

    return {
      total: Number(formatEther(strategy.total)),
      tvl: Number(formatEther(strategy.tvl)),
      holdings: strategy.holdings.reduce((m, o) => {
        m[getSymbol(o)] = Number(formatEther(o.amount));
        return m;
      }, {}),
      holdings_value: strategy.holdings.reduce((m, o) => {
        m[getSymbol(o)] = Number(formatEther(o.value));
        return m;
      }, {}),
    };
  }

  const today = json.data.oethDailyStats[0];
  const circulatingSupply = Number(
    formatEther(BigInt(today.totalSupply) - BigInt(today.amoSupply)),
  );
  const exchangeRate = json.data.exchangeRates[0].rate;

  const totalSupplyUSD = formatEther(
    (BigInt(today.totalSupply) * BigInt(exchangeRate)) / BigInt("100000000"),
  );

  const allocation = {
    block_time: Math.round(
      +new Date(json.data.oethDailyStats[0].timestamp) / 1000,
    ),
    block_number: json.data.oethDailyStats[0].blockNumber,
    strategies: {
      vault_holding: {
        name: "OETH Vault",
        address: "0x39254033945aa2e4809cc2977e7087bee48bd7ab",
        icon_file: "oeth-icon.svg",
        ...holdings("VAULT"),
      },
      frax_eth_strat: {
        name: "FraxETH",
        address: "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
        icon_file: "frxeth-icon.svg",
        ...holdings("FRAX"),
      },
      oeth_curve_amo: {
        name: "OETH/ETH Curve AMO",
        address: "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63",
        icon_file: "oeth-icon.svg",
        ...holdings("CURVE"),
      },
      oeth_morpho_aave_strat: {
        name: "Morpho Aave",
        address: "0xc1fc9e5ec3058921ea5025d703cbe31764756319",
        icon_file: "morpho.png",
        ...holdings("MORPHO"),
      },
      oeth_balancer_reth_strat: {
        name: "Balancer rETH/WETH Pool Strategy",
        address: "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc",
        icon_file: "buffer-icon.svg",
        ...holdings("BALANCER"),
      },
    },
    total_value: Number(totalSupplyUSD),
    total_value_usd: Number(totalSupplyUSD),
    eth_price: Number(formatUnits(json.data.exchangeRates[0].rate, 8)),
    total_supply: Number(formatEther(today.totalSupply)),
    circulating_supply: circulatingSupply,
    protocol_owned_supply: Number(formatEther(today.amoSupply)),
    revenue_all_time: Number(formatEther(today.revenueAllTime)),
  } as Allocation;

  return allocation;
}

export default fetchAllocation;
