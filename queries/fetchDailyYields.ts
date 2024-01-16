import { graphqlClient } from "../utils/graphql";
import { addDays, subDays } from "date-fns";
import { strategyAddresses } from "../sections/proof-of-yield/utils/strategies";

export interface DailyYield {
  timestamp: string;
  strategy: string;
  asset: string;
  balance: string;
  earnings: string;
  earningsChange: string;
  apy: number;
}

export interface DailyYieldsResponse {
  history: Record<string, DailyYield[]>;
  latest: DailyYield[];
}

const gqlQuery = `
  query DailyYields($timestamp_gte: DateTime!, $timestamp_lt: DateTime!, $strategy_in: [String!]) {
    strategyDailyYields(where: {timestamp_gte: $timestamp_gte, timestamp_lt: $timestamp_lt, strategy_in: $strategy_in}, orderBy: timestamp_ASC) {
      timestamp
      strategy
      asset
      balance
      earnings
      earningsChange
      apy
    }
  }
`;

export const fetchDailyYields = async (
  from: Date,
  toExclusive: Date,
  strategyFilter = strategyAddresses,
) => {
  const data = await graphqlClient(gqlQuery, {
    timestamp_gte: from.toISOString(),
    timestamp_lt: toExclusive.toISOString(),
    strategy_in: strategyFilter,
  })();

  const strategies = new Map<string, DailyYield>();
  const history: Record<string, DailyYield[]> = {};
  const yields = (data?.strategyDailyYields ?? []).filter(
    (d) =>
      !(
        // Ignore ETH/WETH in Vault
        (
          d.strategy === "0x39254033945aa2e4809cc2977e7087bee48bd7ab" &&
          d.asset === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        )
      ),
  );
  for (const d of yields) {
    const key = `${d.strategy}+${d.asset}`;
    strategies.set(key, d);
    if (!history[key]) {
      history[key] = [];
    }
    history[key].push(d);
  }
  return {
    latest: Array.from(strategies.values()).sort((a, b) =>
      BigInt(a.balance) > BigInt(b.balance) ? -1 : 1,
    ),
    history,
  };
};
