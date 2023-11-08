import { formatEther } from "viem";

export const getTotalSupply = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query TotalSupply {
          oethDailyStats(orderBy: blockNumber_DESC, limit: 360) {
            id
            timestamp
            totalSupply
            amoSupply
          }
        }`,
        variables: null,
        operationName: "TotalSupply",
      }),
    });
    const json = await res.json();
    const dailyStats = json.data.oethDailyStats.reverse();

    return {
      labels: dailyStats.map((d) => new Date(d.timestamp)),
      datasets: [
        {
          id: "protocol",
          label: "Protocol Owned",
          data: dailyStats.map((d) => formatEther(d.amoSupply)),
        },
        {
          id: "circulating",
          label: "Circulating Supply",
          data: dailyStats.map((d) =>
            formatEther(BigInt(d.totalSupply) - BigInt(d.amoSupply)),
          ),
        },
      ],
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getHandler = async (req, res) => {
  try {
    const data = await getTotalSupply();
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
