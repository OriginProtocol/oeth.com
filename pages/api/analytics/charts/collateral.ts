import { orderBy } from "lodash";
import { aggregateCollateral } from "../../../../utils/analytics";
import { fetchAllocation, fetchCollateral } from "../../../../utils";

export const getCollateral = async () => {
  try {
    const [allocation, { collateral }] = await Promise.all([
      fetchAllocation(),
      fetchCollateral(),
    ]);
    return {
      tvl: allocation.total_supply,
      tvlUsd: allocation.total_value_usd,
      collateral: orderBy(
        aggregateCollateral({ collateral, allocation }),
        "total",
        "desc"
      ),
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getHandler = async (req, res) => {
  try {
    const data = await getCollateral();
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
