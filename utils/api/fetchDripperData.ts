interface DripperResponse {
  token: string;
  dripRate: string;
  ratePerMinute: string;
  ratePerHour: string;
  ratePerDay: string;
  tokenBalance: string;
  available: string;
  updatedAt: string;
}

const formatDripNumber = (num) => Number(num).toFixed(5);

async function fetchDripperData(): Promise<DripperResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v2/oeth/dripper`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch daily stats`);
    }
    const data = await response.json();
    return {
      token: data.token,
      dripRate: formatDripNumber(data.drip_rate),
      ratePerMinute: formatDripNumber(data.rate_per_minute),
      ratePerHour: formatDripNumber(data.rate_per_hour),
      ratePerDay: formatDripNumber(data.rate_per_day),
      tokenBalance: formatDripNumber(data.token_balance),
      available: formatDripNumber(data.collectable),
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchDripperData;
