import Redis from "ioredis";
import { getUnixTime, startOfDay } from "date-fns";
import { toChartData } from "../../../../lib/dune";

const oethPegUrl = (unixFrom, unixTo) =>
  `${process.env.NEXT_PUBLIC_COINGECKO_API}/coins/origin-ether/market_chart/range?vs_currency=eth&precision=6&from=${unixFrom}&to=${unixTo}`;

const OETH_START_TIMESTAMP = 1684209600;

const CACHE_EXPIRATION = 43200; // 12 hours

export const getOETHPeg = async () => {
  try {
    const cacheClient = new Redis(process.env.REDIS_URL, {
      tls: {
        rejectUnauthorized: false,
      },
      connectTimeout: 10000,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 500, 2000);
      },
    });

    let prices;

    // Serves as a cache key
    const pegTo = getUnixTime(startOfDay(new Date()));

    // Check cache for peg data
    const cacheKey = String(pegTo);

    let data = await cacheClient.get(cacheKey);

    // Attempt to parse cached data
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log(e.message);
        data = null;
      }
    }

    // Refetch data
    if (!data) {
      data = await fetch(oethPegUrl(OETH_START_TIMESTAMP, pegTo)).then((res) =>
        res.json()
      );

      // Store in cache
      const cachedResultSet = JSON.stringify(data);

      await cacheClient.set(cacheKey, cachedResultSet, "EX", CACHE_EXPIRATION);

      console.log(
        `oeth peg cached response for ${cacheKey}: ${CACHE_EXPIRATION} seconds`
      );
    }

    // @ts-ignore
    ({ prices } = data || {});

    const formattedPrices = prices.map(([timestamp, value]) => {
      return {
        timestamp: new Date(timestamp),
        value,
      };
    });

    const { all, labels } = toChartData(formattedPrices, {
      value: "all",
      timestamp: "labels",
    });

    // Resolve data
    return {
      labels,
      datasets: [
        {
          id: "all",
          label: "OETH",
          data: all,
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
    const data = await getOETHPeg();
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
