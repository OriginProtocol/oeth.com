import { DailyStat } from "../../types";
import { formatEther } from "viem";

function addOneDay(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

async function fetchProofOfYieldByDay(timestamp: string): Promise<DailyStat[]> {
  try {
    const oneDayLater = addOneDay(timestamp);
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query ProofOfYieldByDay {
          oethDailyStatById(id: "${timestamp}") {
            rebasingSupply
            timestamp
            yield
            apy
            fees
            amoSupply
            totalSupply
            nonRebasingSupply
          }
          oethRebases(orderBy: timestamp_DESC, where: {timestamp_gte: "${timestamp}T00:00:00.000Z", timestamp_lt: "${oneDayLater}T00:00:00.000Z"}) {
            blockNumber
            fee
            totalSupply
            txHash
            yield
            timestamp
          }
        }`,
        variables: null,
        operationName: "ProofOfYieldByDay",
      }),
    });
    const json = await res.json();

    const item = json.data.oethDailyStatById;
    const rebaseEvents = json.data.oethRebases;

    const rawApr =
      (Number(BigInt(item.totalSupply) - BigInt(item.nonRebasingSupply)) /
        Number(BigInt(item.totalSupply) - BigInt(item.amoSupply))) *
      item.apy * 100;

    const rawApy = ((1 + rawApr / 365.25 / 100) ** 365.25 - 1) * 100;

    const apyBoost =
      Number(BigInt(item.totalSupply) - BigInt(item.amoSupply)) /
      Number(BigInt(item.totalSupply) - BigInt(item.nonRebasingSupply));

    return [
      {
        date: item.timestamp,
        yield: formatEther(item.yield),
        fees: formatEther(item.fees),
        backing_supply: formatEther(item.totalSupply),
        rebasing_supply: formatEther(item.rebasingSupply),
        non_rebasing_supply: formatEther(item.nonRebasingSupply),
        apy: (item.apy * 100).toString(),
        raw_apy: rawApy.toFixed(3),
        apy_boost: apyBoost.toFixed(3),
        rebase_events: rebaseEvents.map((event) => {
          const amount = BigInt(event.yield) - BigInt(event.fee);
          return {
            amount: Number(formatEther(amount)),
            fee: Number(formatEther(event.fee)),
            tx_hash: event.txHash,
            block_number: event.blockNumber,
            block_time: event.timestamp,
          };
        }),
      },
    ];
  } catch (err) {
    console.log(`Failed to fetch daily stats: ${err}`);
  }
}

export default fetchProofOfYieldByDay;
