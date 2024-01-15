import React from "react";
import { ContainerHeader } from "../../components/ContainerHeader";
import { ReactNodeLike } from "prop-types";
import { formatEther } from "viem";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { assetRootPath, shortenAddress } from "../../utils";
import Image from "next/image";
import * as dn from "dnum";
import { twMerge } from "tailwind-merge";
import { Container } from "../../components/Container";
import { strategies } from "./utils/strategies";
import { DailyYield } from "../../queries/fetchDailyYields";
import Tooltip from "../../components/proof-of-yield/Tooltip";
import { useElementSize } from "usehooks-ts";
import { Typography } from "@originprotocol/origin-storybook";

const YieldSources = ({
  strategiesLatest,
  strategyHistory,
}: {
  strategiesLatest: DailyYield[];
  strategyHistory: Record<string, DailyYield[]>;
}) => {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const isSmall = width < 700;
  const totalBalance = strategiesLatest.reduce(
    (sum, next) => sum + BigInt(next.balance),
    BigInt(0),
  );
  const dateSpanSource = Object.values(strategyHistory)[0];
  const from = new Date(dateSpanSource[0].timestamp).toISOString().slice(0, 10);
  const to = new Date(dateSpanSource[dateSpanSource.length - 1].timestamp)
    .toISOString()
    .slice(0, 10);

  return (
    <>
      <Typography.Body className="text-xl mt-14">Yield Sources</Typography.Body>
      <Container className="mt-3" ref={ref}>
        {/* Header */}
        <div
          className={twMerge(
            "grid pt-3",
            isSmall
              ? "grid-cols-[6fr_2fr_2fr_1fr]"
              : "grid-cols-[6fr_2fr_minmax(120px,_2fr)_2fr_2fr_1fr]",
          )}
        >
          <Header className="justify-start">Strategy</Header>
          <Header className="justify-end" tooltip={`APY on ${to}`}>
            APY
          </Header>
          <Header
            className={twMerge("justify-end", isSmall ? "hidden" : "flex")}
            tooltip={`${from} through ${to}`}
          >
            30d trend
          </Header>
          <Header className="justify-end" tooltip={`Earnings on ${to}`}>
            Earnings
          </Header>
          <Header
            className={twMerge("justify-end", isSmall ? "hidden" : "flex")}
            tooltip={`Allocation on ${to}`}
          >
            Allocation
          </Header>
          <Header className={isSmall ? "pr-2" : "pr-4"} />
        </div>
        {/* Content */}
        {strategiesLatest.map(
          ({ strategy, asset, balance, earningsChange, apy, timestamp }) => {
            const strategyInfo = strategies.find(
              (s) => s.address === strategy && s.asset === asset,
            );
            const strategyName = strategyInfo.name ?? shortenAddress(strategy);
            const strategyPath = strategyInfo.path;
            const day = timestamp.slice(0, 10);
            return (
              <Row
                key={strategyPath}
                href={`/proof-of-yield/${day}/${strategyPath}`}
                isSmall={isSmall}
                classNames={[
                  "",
                  "justify-end",
                  isSmall ? "hidden" : "flex",
                  isSmall ? "hidden" : "justify-end flex",
                  "justify-end",
                  "justify-end",
                ]}
                elements={[
                  <div className="truncate">{strategyName}</div>,
                  (apy * 100).toFixed(2) + "%",
                  <SparklineChart
                    data={strategyHistory[`${strategy}+${asset}`].map(
                      (d) => d.apy,
                    )}
                  />,
                  Number(formatEther(BigInt(earningsChange))).toFixed(4),
                  `${dn.format(dn.mul(dn.div(balance, totalBalance, 18), 100), {
                    digits: 1,
                    trailingZeros: true,
                  })}%`,
                  <Image
                    src={assetRootPath("/images/ext-link-white.svg")}
                    width="14"
                    height="14"
                    alt="ext-link"
                    className={twMerge(
                      "inline min-w-[8px] min-h-[8px] ",
                      isSmall ? "w-[8px] h-[8px]" : "ml-2 w-[14px] h-[14px]",
                    )}
                  />,
                ]}
              />
            );
          },
        )}
      </Container>
    </>
  );
};

export default YieldSources;

const Header = ({
  children,
  className,
  tooltip,
}: {
  children?: ReactNodeLike;
  className?: string | undefined;
  tooltip?: string;
}) => (
  <div
    className={twMerge(
      "flex items-center gap-1.5 text-xs md:text-sm text-origin-white/60 px-2 first:pl-3 last:pr-3 md:first:pl-8 md:last:pr-4 py-2",
      className,
    )}
  >
    {children}
    {tooltip && <Tooltip tooltipClassName="whitespace-nowrap" info={tooltip} />}
  </div>
);

const Row = ({
  elements,
  classNames,
  href,
  isSmall,
}: {
  elements: ReactNodeLike[];
  classNames: string[];
  href: string;
  isSmall: boolean;
}) => (
  <a
    className={twMerge(
      "grid hover:bg-white/5 cursor-pointer",
      isSmall
        ? "grid-cols-[6fr_2fr_2fr_1fr]"
        : "grid-cols-[6fr_2fr_minmax(120px,_2fr)_2fr_2fr_1fr]",
    )}
    href={href}
  >
    {elements.map((element, i) => (
      <div
        key={i}
        className={twMerge(
          "flex items-center truncate text-sm md:text-base text-origin-white px-2 first:pl-3 last:pr-3 md:first:pl-8 md:last:pr-4 py-2 h-12",
          classNames[i],
        )}
      >
        {element}
      </div>
    ))}
  </a>
);

const SparklineChart = ({ data }) => {
  const options: React.ComponentProps<typeof Line>["options"] = {
    responsive: true,
    maintainAspectRatio: false,
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
