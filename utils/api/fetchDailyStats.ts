async function fetchDailyStats() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query APY {
          oethDailyStats(orderBy: blockNumber_DESC, limit: 1) {
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

    return [json.data.oethDailyStats[0].apy7DayAvg, json.data.apies[0].apy30DayAvg];
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }

  return null;
}

export default fetchDailyStats;
