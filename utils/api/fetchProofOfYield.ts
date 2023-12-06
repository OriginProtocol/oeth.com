import { DailyStat } from "../../types";
import { formatEther } from "viem";

async function fetchProofOfYield(offset: number = 0): Promise<DailyStat[]> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query ProofOfYields {
            oethDailyStats(orderBy: timestamp_DESC, limit: 30, offset: ${offset}) {
              id
              timestamp
              rebasingSupply
              yieldETH
              feesETH
              apy
            }
          }`,
        variables: null,
        operationName: "ProofOfYields",
      }),
    });
    const json = await res.json();
    return json.data.oethDailyStats.map((item) => {
      return {
        date: item.timestamp,
        yield: formatEther(item.yieldETH),
        apy: (item.apy * 100).toString(),
        rebasing_supply: formatEther(item.rebasingSupply),
      };
    });
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchProofOfYield;
