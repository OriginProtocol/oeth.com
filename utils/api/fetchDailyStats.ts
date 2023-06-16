import { DailyStat } from "../../types";

interface DailyStatsResponse {
  daily: DailyStat[];
}

async function fetchDailyStats(
  end: number,
  startAt?: number
): Promise<DailyStat[]> {
  try {
    let endpoint = `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v2/oeth/daily_stats/${end}`;
    if (startAt) endpoint += `/${startAt}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch daily stats`);
    }

    const json: DailyStatsResponse = await response.json();
    return json.daily;
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchDailyStats;
