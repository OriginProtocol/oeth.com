import React, { useMemo } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import { SectionBody } from "../../components/SectionBody";
import { ReactNodeLike } from "prop-types";
import { useQuery } from "react-query";
import { graphqlClient } from "../../utils/graphql";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { TailSpin } from "react-loader-spinner";
import { formatEther } from "viem";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { shortenAddress } from "../../utils";

interface DailyYield {
  timestamp: string;
  strategy: string;
  asset: string;
  earnings: string;
  earningsChange: string;
  apy: number;
}

const strategyMap: Record<string, string | undefined> = {
  "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5": "Staked Frax Ether",
  "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63": "Convex ETH+OETH Curve pool",
  "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc": "Aura WETH+rETH Balancer pool",
  "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae7ab96520de3a18e5e111b5eaab095312d7fe84":
    "Lido Staked Ether",
  "0x39254033945aa2e4809cc2977e7087bee48bd7ab+0xae78736cd615f374d3085123a210448e74fc6393":
    "Rocket Pool ETH",
  "TBD?": "Aave V2 Optimizer WETH",
  "0xc1fc9e5ec3058921ea5025d703cbe31764756319": "Morpho Aave",
};

const strategyFilter = [
  "0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
  "0x1827f9ea98e0bf96550b2fc20f7233277fcd7e63",
  "0x49109629ac1deb03f2e9b2fe2ac4a623e0e7dfdc",
  "0x39254033945aa2e4809cc2977e7087bee48bd7ab", // Vault
  "0xc1fc9e5ec3058921ea5025d703cbe31764756319",
];

const YieldSources = ({ date }: { date: Date }) => {
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
      strategy_in: strategyFilter,
    }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

  const { strategies, strategyHistory } = useMemo(() => {
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
      strategies: Array.from(strategies.values()).sort((a, b) =>
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
      <SectionHeader>Yield Sources</SectionHeader>
      <SectionBody>
        <div className="grid grid-cols-[4fr_2fr_2fr_2fr]">
          {/* Header */}
          <Header>Strategy</Header>
          <Header>APY</Header>
          <Header>7-day trend</Header>
          <Header>Earnings</Header>
          {/* Content */}
          {strategies.map((strategy) => (
            <Row
              key={strategy.strategy}
              elements={[
                strategyMap[strategy.strategy] ??
                  strategyMap[`${strategy.strategy}+${strategy.asset}`] ??
                  shortenAddress(strategy.strategy),
                (strategy.apy * 100).toFixed(2) + "%",
                <div className="h-10">
                  <SparklineChart
                    data={strategyHistory
                      .get(`${strategy.strategy}+${strategy.asset}`)
                      .map((d) => d.apy)}
                  />
                </div>,
                <div className="flex justify-end">
                  {Number(formatEther(BigInt(strategy.earningsChange))).toFixed(
                    4,
                  )}
                </div>,
              ]}
            />
          ))}
        </div>
      </SectionBody>
    </Container>
  );
};

export default YieldSources;

const Container = ({
  children,
  className,
}: {
  children: ReactNodeLike;
  className?: string | undefined;
}) => (
  <div
    className={
      "flex flex-col gap-4 w-full bg-origin-bg-grey rounded md:rounded-lg border-spacing-0" +
      (className ? ` ${className}` : "")
    }
  >
    {children}
  </div>
);

const Header = ({ children }: { children: ReactNodeLike }) => (
  <div className={"text-origin-white/60"}>{children}</div>
);

const Row = ({ elements }: { elements: ReactNodeLike[] }) => (
  <>
    {elements.map((element, i) => (
      <Cell>{element}</Cell>
    ))}
  </>
);

const Cell = ({ children }: { children: ReactNodeLike }) => (
  <div className={"text-lg text-origin-white py-3 flex items-center"}>
    {children}
  </div>
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
