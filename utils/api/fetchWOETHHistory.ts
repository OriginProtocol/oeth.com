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
          }
        }`,
        variables: null,
        operationName: "WOETH",
      }),
    });
    const json = await res.json();

    return {
      pctWOETH: json.data.oethDailyStats
        .map((item) => ({
          day: item.id,
          pct:
            (Number(formatEther(item.wrappedSupply)) /
              Number(formatEther(item.totalSupply))) *
            100,
        }))
        .reverse(),
    };
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchApy;
