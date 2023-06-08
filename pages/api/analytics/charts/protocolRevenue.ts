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

    const {
      revenue_daily,
      yield_daily,
      revenue_total,
      yield_total,
      _7_day,
      _14_day,
      _30_day,
      _7_yield_day,
      _14_yield_day,
      _30_yield_day,
      labels,
    } = toChartData(rows, {
      amount: "revenue_daily",
      _7_day_avg_yield_generated: "_7_yield_day",
      _14_day_avg_yield_generated: "_14_yield_day",
      _30_day_avg_yield_generated: "_30_yield_day",
      _7_day_avg_amount: "_7_day",
      _14_day_avg_amount: "_14_day",
      _30_day_avg_amount: "_30_day",
      yield_generated: "yield_daily",
      sum_amount: "revenue_total",
      sum_yield_generated: "yield_total",
      day: "labels",
    });

    return {
      labels,
      datasets: [
        {
          id: "_7_day",
          label: "7-day trailing avg",
          data: _7_day.map(
            (value, index) => (_7_yield_day[index] || 0) + value
          ),
          type: "line",
          backgroundColor: "#FFFFFF",
        },
        {
          id: "_14_day",
          label: "14-day trailing avg",
          data: _14_day.map(
            (value, index) => (_14_yield_day[index] || 0) + value
          ),
          type: "line",
          backgroundColor: "#FFFFFF",
        },
        {
          id: "_30_day",
          label: "30-day trailing avg",
          data: _30_day.map(
            (value, index) => (_30_yield_day[index] || 0) + value
          ),
          type: "line",
          backgroundColor: "#FFFFFF",
        },
        {
          id: "yield_daily",
          label: "Yield Distributed",
          data: yield_daily,
          backgroundColor: "#426EF7",
        },
        {
          id: "revenue_daily",
          label: "Fees Collected",
          data: revenue_daily,
          backgroundColor: "#E7A9BF",
        },
      ],
      aggregations: {
        // Revenue agg
        dailyRevenue: Number(last(revenue_daily)) + Number(last(yield_daily)),
        weeklyRevenue:
          sumOf(takeRight(revenue_daily, 7)) + sumOf(takeRight(yield_daily, 7)),
        allTimeRevenue: Number(last(revenue_total)) + Number(last(yield_total)),
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
