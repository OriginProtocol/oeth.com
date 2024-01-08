import React from "react";
import { ContainerHeader } from "../../components/ContainerHeader";
import { ReactNodeLike } from "prop-types";
import { formatEther } from "viem";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { assetRootPath, shortenAddress } from "../../utils";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Container } from "../../components/Container";
import { strategies } from "./utils/strategies";
import { DailyYield } from "../../queries/fetchDailyYields";

const YieldSources = ({
  strategiesLatest,
  strategyHistory,
}: {
  strategiesLatest: DailyYield[];
  strategyHistory: Record<string, DailyYield[]>;
}) => {
  return (
    <Container>
      <ContainerHeader>Yield Sources</ContainerHeader>
      <table className="w-full mb-2">
        {/* Header */}
        <thead>
          <tr>
            <Header className="text-left">Strategy</Header>
            <Header className="text-right">APY</Header>
            <Header className="text-right">7-day trend</Header>
            <Header className="text-right">Earnings</Header>
            <Header />
          </tr>
        </thead>
        {/* Content */}
        <tbody>
          {strategiesLatest.map(
            ({ strategy, asset, earningsChange, apy, timestamp }, i) => {
              const strategyInfo = strategies.find(
                (s) => s.address === strategy && s.asset === asset,
              );
              const strategyName =
                strategyInfo.name ?? shortenAddress(strategy);
              const strategyPath = strategyInfo.path;
              const day = timestamp.slice(0, 10);
              return (
                <Row
                  key={strategyPath}
                  href={`/proof-of-yield/${day}/${strategyPath}`}
                  elements={[
                    strategyName,
                    <div className="flex justify-end">
                      {(apy * 100).toFixed(2) + "%"}
                    </div>,
                    <div className="flex justify-end h-10">
                      <SparklineChart
                        data={strategyHistory[`${strategy}+${asset}`].map(
                          (d) => d.apy,
                        )}
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
                      className="inline md:ml-2 min-w-[8px] min-h-[8px] w-[8px] h-[8px] md:w-[14px] md:h-[14px]"
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
      "text-xs md:text-sm text-origin-white/60 px-2 first:pl-3 last:pr-3 md:first:pl-8 md:last:pr-4 py-2",
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
  <tr
    className="hover:bg-white/5 cursor-pointer"
    onClick={(e) => {
      let target = e.shiftKey ? "_blank" : e.metaKey ? undefined : "_self";
      window.open(href, target);
      e.preventDefault();
      return false;
    }}
    onMouseDown={(e) => {
      if (e.button === 1) {
        window.open(href);
      }
    }}
  >
    {elements.map((element, i) => (
      <td
        key={i}
        className="table-cell align-middle text-sm md:text-base text-origin-white px-2 first:pl-3 last:pr-3 md:first:pl-8 md:last:pr-4 py-2 h-12"
      >
        {element}
      </td>
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
