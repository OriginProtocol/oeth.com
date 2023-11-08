import { formatEther } from "viem";

async function fetchCollateral() {
  const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query Collateral {
          oethDailyStats(orderBy: blockNumber_DESC, limit: 1) {
            id
            collateral {
              price
              symbol
              value
              amount
            }
          }
        }`,
      variables: null,
      operationName: "Collateral",
    }),
  });
  const json = await res.json();

  const collateral = json.data.oethDailyStats[0].collateral.map((c) => {
    return {
      name: c.symbol.toLowerCase(),
      total: formatEther(c.amount),
      price: c.price,
      value: formatEther(c.value),
    };
  });

  return { collateral };
}

export default fetchCollateral;
