import { graphqlClient } from "../utils/graphql";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { strategyAddresses } from "../sections/proof-of-yield/utils/strategies";

export interface DailyYield {
  timestamp: string;
  strategy: string;
  asset: string;
  earnings: string;
  earningsChange: string;
  apy: number;
}

const gqlQuery = `
  query DailyYields($timestamp_gte: DateTime!, $timestamp_lte: DateTime!, $strategy_in: [String!]) {
    strategyDailyYields(where: {timestamp_gte: $timestamp_gte, timestamp_lte: $timestamp_lte, strategy_in: $strategy_in}, orderBy: timestamp_ASC) {
      timestamp
      strategy
      asset
      earnings
      earningsChange
      apy
    }
  }
`;

export const fetchDailyYields = async (
  date: Date,
  days = 7,
  strategyFilter = strategyAddresses,
) => {
  const data = await graphqlClient(gqlQuery, {
    timestamp_gte: startOfDay(subDays(date, days - 1)).toISOString(),
    timestamp_lte: endOfDay(date).toISOString(),
    strategy_in: strategyFilter,
  })();

  const strategies = new Map<string, DailyYield>();
  const strategyHistory: Record<string, DailyYield[]> = {};
  const yields = (data?.strategyDailyYields ?? []).filter(
    (d) =>
      !(
        d.strategy === "0x39254033945aa2e4809cc2977e7087bee48bd7ab" &&
        d.asset === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ),
  );
  for (const d of yields) {
    const key = `${d.strategy}+${d.asset}`;
    strategies.set(key, d);
    if (!strategyHistory[key]) {
      strategyHistory[key] = [];
    }
    strategyHistory[key].push(d);
  }
  return {
    strategiesLatest: Array.from(strategies.values()).sort((a, b) =>
      a.apy > b.apy ? -1 : 1,
    ),
    strategyHistory,
  };
};
