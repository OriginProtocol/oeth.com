import { chunk, last, takeRight, map } from "lodash";
import DuneClient, { toChartData, jobsLookup } from "../../../../lib/dune";
import { sumOf } from "../../../../utils/analytics";

export const getProtocolRevenue = async () => {
  try {
    const client = new DuneClient(process.env.DUNE_API_KEY);

    const {
      result: { rows },
    } = await client.refresh(jobsLookup.protocolRevenue.queryId);

    rows.reverse();

    const chunked = chunk(rows, 2);

    const dailyRevRows = chunked.reduce((acc, chunk) => {
      const [before, after] = chunk;
      if (after) {
        acc.push({
          // @ts-ignore
          sum_amount:
            parseFloat(after?.sum_amount) - parseFloat(before?.sum_amount),
          day: after?.day,
        });
      }
      return acc;
    }, []);

    const { total, labels } = toChartData(dailyRevRows, {
      sum_amount: "total",
      day: "labels",
    });

    const allRawAmounts = map(rows, "sum_amount");
    const dailyDevAmounts = map(dailyRevRows, "sum_amount");

    return {
      labels,
      datasets: [
        {
          id: "total",
          label: "Daily Revenue",
          data: total,
        },
      ],
      aggregations: {
        dailyRevenue: last(dailyDevAmounts),
        weeklyRevenue: sumOf(takeRight(dailyDevAmounts, 7)),
        allTimeRevenue: last(allRawAmounts),
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
