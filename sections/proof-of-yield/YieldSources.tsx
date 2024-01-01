import React, { useMemo } from "react";
import { ContainerHeader } from "../../components/ContainerHeader";
import { ReactNodeLike } from "prop-types";
import { useQuery } from "react-query";
import { graphqlClient } from "../../utils/graphql";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { TailSpin } from "react-loader-spinner";
import { formatEther } from "viem";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { assetRootPath, shortenAddress } from "../../utils";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Container } from "../../components/Container";
import { strategies, strategyAddresses } from "./utils/strategies";

interface DailyYield {
  timestamp: string;
  strategy: string;
  asset: string;
  earnings: string;
  earningsChange: string;
  apy: number;
}

const YieldSources = ({ date }: { date: Date }) => {
  // TODO: pull server-side?
  const gqlQuery = `
    query DailyYields($timestamp_gte: DateTime!, $timestamp_lte: DateTime!, $strategy_in: [String!]) {
      strategyDailyYields(where: {timestamp_gte: $timestamp_gte, timestamp_lte: $timestamp_lte, strategy_in: $strategy_in}, orderBy: timestamp_ASC) {
        timestamp
        strategy
        asset
        earnings
        earningsChange
        apy
      }
    }
  `;
  const { data, isFetching } = useQuery<{ strategyDailyYields: DailyYield[] }>(
    process.env.NEXT_PUBLIC_SUBSQUID_URL,
    graphqlClient(gqlQuery, {
      timestamp_gte: startOfDay(subDays(date, 6)).toISOString(),
      timestamp_lte: endOfDay(date).toISOString(),
      strategy_in: strategyAddresses,
    }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

  const { strategiesLatest, strategyHistory } = useMemo(() => {
    const strategies = new Map<string, DailyYield>();
    const strategyHistory = new Map<string, DailyYield[]>();
    const yields = (data?.strategyDailyYields ?? []).filter(
      (d) =>
        !(
          d.strategy === "0x39254033945aa2e4809cc2977e7087bee48bd7ab" &&
          d.asset === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ),
    );
    for (const d of yields) {
      const key = `${d.strategy}+${d.asset}`;
      strategies.set(key, d);
      if (!strategyHistory.has(key)) {
        strategyHistory.set(key, []);
      }
      strategyHistory.get(key).push(d);
    }
    return {
      strategiesLatest: Array.from(strategies.values()).sort((a, b) =>
        a.apy > b.apy ? -1 : 1,
      ),
      strategyHistory,
    };
  }, [data]);

  if (isFetching) {
    return (
      <Container className="justify-center items-center p-6 md:p-12">
        <TailSpin
          height="100"
          width="100"
          color="#0074F0"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="justify-center items-center p-6 md:p-12">
        There was an issue loading data. Refresh to try again.
      </Container>
    );
  }
  return (
    <Container>
      <ContainerHeader>Yield Sources</ContainerHeader>
      <table className="w-full mb-2">
        {/* Header */}
        <thead>
          <Header className="text-left">Strategy</Header>
          <Header className="text-right">APY</Header>
          <Header className="text-right">7-day trend</Header>
          <Header className="text-right">Earnings</Header>
          <Header />
        </thead>
        {/* Content */}
        <tbody>
          {strategiesLatest.map(
            ({ strategy, asset, earningsChange, apy }, i) => {
              const strategyInfo = strategies.find(
                (s) => s.address === strategy && s.asset === asset,
              );
              const strategyName =
                strategyInfo.name ?? shortenAddress(strategy);
              const strategyPath = strategyInfo.path;
              return (
                <Row
                  key={strategy}
                  href={`/proof-of-yield/2023-12-25/${strategyPath}`}
                  elements={[
                    strategyName,
                    <div className="flex justify-end">
                      {(apy * 100).toFixed(2) + "%"}
                    </div>,
                    <div className="flex justify-end h-10">
                      <SparklineChart
                        data={strategyHistory
                          .get(`${strategy}+${asset}`)
                          .map((d) => d.apy)}
                      />
                    </div>,
                    <div className="flex justify-end">
                      {Number(formatEther(BigInt(earningsChange))).toFixed(4)}
                    </div>,
                    <Image
                      src={assetRootPath("/images/ext-link-white.svg")}
                      width="14"
                      height="14"
                      alt="ext-link"
                      className="inline md:ml-2 w-[8px] h-[8px] md:w-[14px] md:h-[14px]"
                    />,
                  ]}
                />
              );
            },
          )}
        </tbody>
      </table>
    </Container>
  );
};

export default YieldSources;

const Header = ({
  children,
  className,
}: {
  children?: ReactNodeLike;
  className?: string | undefined;
}) => (
  <th
    className={twMerge(
      "text-xs md:text-sm text-origin-white/60 px-2 first:pl-8 last:pr-2 py-2",
      className,
    )}
  >
    {children}
  </th>
);

const Row = ({
  elements,
  href,
}: {
  elements: ReactNodeLike[];
  href: string;
}) => (
  <tr className="hover:bg-white/5">
    {elements.map((element, i) => (
      <Link
        key={i}
        href={href}
        className="table-cell align-middle text-sm md:text-base text-origin-white px-2 first:pl-8 last:pr-4 py-2 h-12"
      >
        {element}
      </Link>
    ))}
  </tr>
);

const SparklineChart = ({ data }) => {
  const options: React.ComponentProps<typeof Line>["options"] = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    datasets: {
      line: {
        pointStyle: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  } as const;

  const chartData = {
    labels: data.map((_, index) => index), // Assuming data is an array of values
    datasets: [
      {
        data: data,
        borderColor: "#586CF8",
        borderWidth: 2,
        tension: 0.3, // Adjust for smoother lines
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};
