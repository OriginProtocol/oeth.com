import { formatEther } from "viem";

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
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query Dripper {
          oethDrippers(orderBy: timestamp_DESC, limit: 1) {
            lastCollectTimestamp
            weth
            dripRatePerBlock
            dripDuration
            timestamp
          }
        }`,
        variables: null,
        operationName: "Dripper",
      }),
    });
    const json = await res.json();
    const dripper = json.data.oethDrippers[0];

    const dripRate = Number(formatEther(dripper.dripRatePerBlock));
    const elapsed =
      Math.floor(Date.now() / 1000) - dripper.lastCollectTimestamp;

    return {
      token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      dripRate: formatDripNumber(dripRate),
      ratePerMinute: formatDripNumber(dripRate * 60),
      ratePerHour: formatDripNumber(dripRate * 60 * 60),
      ratePerDay: formatDripNumber(dripRate * 60 * 60 * 24),
      tokenBalance: formatDripNumber(formatEther(dripper.weth)),
      available: formatDripNumber(elapsed * dripRate),
      updatedAt: dripper.timestamp,
    };
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchDripperData;
