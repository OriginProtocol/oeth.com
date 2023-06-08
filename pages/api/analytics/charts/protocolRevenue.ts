import { last, takeRight } from "lodash";
import DuneClient, { toChartData, jobsLookup } from "../../../../lib/dune";
import { createGradient, sumOf } from "../../../../utils/analytics";

export const getProtocolRevenue = async () => {
  try {
    const client = new DuneClient(process.env.DUNE_API_KEY);

    const {
      result: { rows },
    } = await client.refresh(jobsLookup.protocolRevenue.queryId);

    rows.reverse();

    const { revenue_daily, yield_daily, revenue_total, yield_total, labels } =
      toChartData(rows, {
        amount: "revenue_daily",
        yield_generated: "yield_daily",
        sum_amount: "revenue_total",
        sum_yield_generated: "yield_total",
        day: "labels",
      });
    return {
      labels,
      datasets: [
        {
          id: "total",
          label: "Yield Distributed",
          data: yield_daily,
          backgroundColor: "#426EF7",
        },
        {
          id: "total",
          label: "Fees Collected",
          data: revenue_daily,
          backgroundColor: "#E7A9BF",
        },
      ],
      aggregations: {
        // Revenue
        dailyRevenue: last(revenue_daily),
        weeklyRevenue: sumOf(takeRight(revenue_daily, 7)),
        allTimeRevenue: last(revenue_total),
        // Yield
        dailyYield: last(yield_daily),
        weeklyYield: sumOf(takeRight(yield_daily, 7)),
        allTimeYield: last(yield_total),
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
