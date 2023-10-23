import { formatEther } from "viem";

export const getProtocolRevenue = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query TotalSupply {
          oethDailyStats(orderBy: blockNumber_DESC, limit: 360) {
            id
            timestamp
            yield
            fees
            revenue
            revenueAllTime
            revenue7DayTotal
            revenue7DayAvg
          }
        }`,
        variables: null,
        operationName: "TotalSupply",
      }),
    });

    const json = await res.json();
    const dailyStats = json.data.oethDailyStats.reverse();
    const today = dailyStats[dailyStats.length - 1];

    return {
      labels: dailyStats.map((d) => new Date(d.timestamp)),
      datasets: [
        {
          id: "_7_day",
          label: "7-day trailing avg",
          data: dailyStats.map((d) => formatEther(d.revenue7DayAvg)),
          type: "line",
          backgroundColor: "#FFFFFF",
        },
        {
          id: "yield_daily",
          label: "Yield Distributed",
          data: dailyStats.map((d) => formatEther(d.yield)),
          backgroundColor: "#426EF7",
        },
        {
          id: "revenue_daily",
          label: "Fees Collected",
          data: dailyStats.map((d) => formatEther(d.fees)),
          backgroundColor: "#E7A9BF",
        },
      ],
      aggregations: {
        // Revenue agg
        dailyRevenue: formatEther(today.revenue),
        weeklyRevenue: formatEther(today.revenue7DayTotal),
        allTimeRevenue: formatEther(today.revenueAllTime),
      },
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getHandler = async (req, res) => {
  try {
    const data = await getProtocolRevenue();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

const handler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "OPTIONS"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
