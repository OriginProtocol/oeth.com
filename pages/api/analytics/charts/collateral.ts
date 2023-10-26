import { orderBy } from "lodash";
import { backingTokens } from "../../../../utils/analytics";
import { formatEther } from "viem";

export const getCollateral = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query TotalSupply {
          oethDailyStats(orderBy: timestamp_DESC, limit: 1) {
            id
            timestamp
            totalSupply
            amoSupply
            collateral {
              symbol
              price
              amount
              value
            }
          }
          exchangeRates(limit: 1, orderBy: timestamp_DESC, where: {pair_eq: "ETH_USD"}) {
            rate
            timestamp
          }
        }`,
        variables: null,
        operationName: "TotalSupply",
      }),
    });
    const json = await res.json();
    const dailyStats = json.data.oethDailyStats.reverse();
    const today = dailyStats[0];
    const circulatingSupply = Number(
      formatEther(BigInt(today.totalSupply) - BigInt(today.amoSupply)),
    );
    const exchangeRate = json.data.exchangeRates[0].rate;

    const totalSupplyUSD = formatEther(
      (BigInt(today.totalSupply) * BigInt(exchangeRate)) / BigInt("100000000"),
    );

    return {
      tvl: Number(formatEther(today.totalSupply)),
      tvlUsd: Number(totalSupplyUSD),
      collateral: orderBy(
        today.collateral.map((c) => {
          const total = Number(formatEther(c.amount));
          const totalValue = Number(formatEther(c.value));
          return {
            total,
            percentage: totalValue / circulatingSupply,
            ...backingTokens[c.symbol],
          };
        }),
        "total",
        "desc",
      ),
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getHandler = async (req, res) => {
  try {
    const data = await getCollateral();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "OPTIONS"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
