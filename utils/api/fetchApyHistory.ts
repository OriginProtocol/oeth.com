async function fetchApy(days: number = 14) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query APY {
          oethDailyStats(orderBy: blockNumber_DESC, limit: ${days}, where: {timestamp_gte: "2023-06-01T00:00:00.000000Z"}) {
            apy7DayAvg
            apy30DayAvg
            id
          }
        }`,
        variables: null,
        operationName: "APY",
      }),
    });
    const json = await res.json();

    return {
      apy7: json.data.oethDailyStats
        .map((item) => ({
          day: item.id,
          trailing_apy: item.apy7DayAvg * 100,
        }))
        .reverse(),
      apy30: json.data.oethDailyStats
        .map((item) => ({
          day: item.id,
          trailing_apy: item.apy30DayAvg * 100,
        }))
        .reverse(),
    };
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchApy;
