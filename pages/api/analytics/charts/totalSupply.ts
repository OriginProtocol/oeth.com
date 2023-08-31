import Redis from "ioredis";
import { fromUnixTime, getUnixTime, startOfDay } from "date-fns";
import { toChartData } from "../../../../lib/dune";

const tvlHistoryUrl = (days) =>
  `${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/api/v2/oeth/tvl_history/${days}`;

const CACHE_EXPIRATION = 14400; // 4 hours

export const getTotalSupply = async () => {
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

    // Check cache for peg data
    const days = 365;
    const startTimestamp = getUnixTime(startOfDay(new Date()));
    const cacheKey = `${String(startTimestamp)}_${days}`;

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
      ({ data } = await fetch(tvlHistoryUrl(days)).then((res) => res.json()));

      // Store in cache
      const cachedResultSet = JSON.stringify(data);

      await cacheClient.set(cacheKey, cachedResultSet, "EX", CACHE_EXPIRATION);

      console.log(
        `oeth peg cached response for ${cacheKey}: ${CACHE_EXPIRATION} seconds`
      );
    }

    // @ts-ignore
    const formattedData = data.map(
      ({ block_time, circulating_supply, protocol_owned_supply }) => ({
        block_date: new Date(fromUnixTime(block_time)),
        circulating_supply,
        protocol_owned_supply,
      })
    );

    const { circulatingSupply, protocolOwned, labels } = toChartData(
      formattedData,
      {
        circulating_supply: "circulatingSupply",
        protocol_owned_supply: "protocolOwned",
        block_date: "labels",
      }
    );

    return {
      labels: labels || [],
      datasets: [
        {
          id: "protocol",
          label: "Protocol Owned",
          data: protocolOwned || [],
        },
        {
          id: "circulating",
          label: "Circulating Supply",
          data: circulatingSupply || [],
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
