import { formatEther } from "viem";

async function fetchApy(days: number = 14) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query WOETH {
          oethDailyStats(orderBy: blockNumber_DESC, limit: ${days}, where: {timestamp_gte: "2023-06-01T00:00:00.000000Z"}) {
            id
            totalSupply
            wrappedSupply
            amoSupply
          }
        }`,
        variables: null,
        operationName: "WOETH",
      }),
    });
    const json = await res.json();

    return {
      pctWOETH: json.data.oethDailyStats
        .map((item) => {
          const circSupply = asNum(item.totalSupply) - asNum(item.amoSupply);
          const wrappedSupply = asNum(item.wrappedSupply);
          return {
            day: item.id,
            pct: (wrappedSupply / circSupply) * 100,
          };
        })
        .reverse(),
    };
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

function asNum(value: bigint) {
  return Number(formatEther(value));
}

export default fetchApy;
