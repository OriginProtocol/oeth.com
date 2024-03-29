import { useQuery } from "react-query";

import type * as Types from "./generated/graphql";
import type { UseQueryOptions } from "react-query";
import { graphqlClient } from "../../utils/graphql";

export type FinancialStatementQueryVariables = Types.Exact<{
  compareDate?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type FinancialStatementQuery = {
  __typename?: "Query";
  oeths: Array<{
    __typename?: "OETH";
    blockNumber: number;
    timestamp: string;
    totalSupply: string;
  }>;
  curveLps: Array<{
    __typename?: "CurveLP";
    blockNumber: number;
    timestamp: string;
    eth: string;
    ethOwned: string;
    oeth: string;
    oethOwned: string;
    totalSupply: string;
    totalSupplyOwned: string;
  }>;
  morphoAaves: Array<{
    __typename?: "MorphoAave";
    blockNumber: number;
    timestamp: string;
    weth: string;
  }>;
  fraxStakings: Array<{
    __typename?: "FraxStaking";
    blockNumber: number;
    timestamp: string;
    frxETH: string;
  }>;
  drippers: Array<{
    __typename?: "Dripper";
    blockNumber: number;
    timestamp: string;
    weth: string;
  }>;
  vaults: Array<{
    __typename?: "Vault";
    blockNumber: number;
    timestamp: string;
    weth: string;
    rETH: string;
    stETH: string;
    frxETH: string;
  }>;
  balancerMetaPoolStrategies: Array<{
    __typename?: "BalancerMetaPoolStrategy";
    blockNumber: number;
    timestamp: string;
    total: string;
    rETH: string;
    weth: string;
  }>;
};

export const FinancialStatementDocument = `
query FinancialStatement($compareDate: DateTime) {
  oeths(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    totalSupply
  }
  curveLps(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    eth
    ethOwned
    oeth
    oethOwned
    totalSupply
    totalSupplyOwned
  }
  morphoAaves(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    weth
  }
  fraxStakings(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    frxETH
  }
  drippers(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    weth
  }
  vaults(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    weth
    rETH
    stETH
    frxETH
  }
  balancerMetaPoolStrategies(limit: 1, orderBy: id_DESC, where: {timestamp_lt: $compareDate}) {
    blockNumber
    timestamp
    total
    rETH
    weth
  }
}
    `;
export const useFinancialStatementQuery = <
  TData = FinancialStatementQuery,
  TError = unknown,
>(
  variables?: FinancialStatementQueryVariables,
  options?: UseQueryOptions<FinancialStatementQuery, TError, TData>,
) =>
  useQuery<FinancialStatementQuery, TError, TData>(
    variables === undefined
      ? ["FinancialStatement"]
      : ["FinancialStatement", variables],
    graphqlClient<FinancialStatementQuery, FinancialStatementQueryVariables>(
      FinancialStatementDocument,
      variables,
    ),
    options,
  );

useFinancialStatementQuery.getKey = (
  variables?: FinancialStatementQueryVariables,
) =>
  variables === undefined
    ? ["FinancialStatement"]
    : ["FinancialStatement", variables];
useFinancialStatementQuery.fetcher = (
  variables?: FinancialStatementQueryVariables,
  options?: RequestInit["headers"],
) =>
  graphqlClient<FinancialStatementQuery, FinancialStatementQueryVariables>(
    FinancialStatementDocument,
    variables,
    options,
  );
