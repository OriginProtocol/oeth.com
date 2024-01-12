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

const YieldSources = ({
  strategiesLatest,
  strategyHistory,
}: {
  strategiesLatest: DailyYield[];
  strategyHistory: Record<string, DailyYield[]>;
}) => {
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
    <Container>
      <ContainerHeader className="flex justify-between items-start">
        <span>Yield Sources</span>
      </ContainerHeader>
      <table className="w-full mb-2">
        {/* Header */}
        <thead>
          <tr>
            <Header className="justify-start">Strategy</Header>
            <Header className="justify-end" tooltip={`APY on ${to}`}>
              APY
            </Header>
            <Header className="justify-end" tooltip={`${from} through ${to}`}>
              30-day trend
            </Header>
            <Header className="justify-end" tooltip={`Earnings on ${to}`}>
              Earnings
            </Header>
            <Header className="justify-end" tooltip={`Allocation on ${to}`}>
              Allocation
            </Header>
            <Header />
          </tr>
        </thead>
        {/* Content */}
        <tbody>
          {strategiesLatest.map(
            ({ strategy, asset, balance, earningsChange, apy, timestamp }) => {
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
                    <div className="flex justify-center h-10 w-full">
                      <div className="w-24">
                        <SparklineChart
                          data={strategyHistory[`${strategy}+${asset}`].map(
                            (d) => d.apy,
                          )}
                        />
                      </div>
                    </div>,
                    <div className="flex justify-end">
                      {Number(formatEther(BigInt(earningsChange))).toFixed(4)}
                    </div>,
                    <div className="flex justify-end">
                      {`${dn.format(
                        dn.mul(dn.div(balance, totalBalance, 18), 100),
                        {
                          digits: 1,
                          trailingZeros: true,
                        },
                      )}%`}
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
  tooltip,
}: {
  children?: ReactNodeLike;
  className?: string | undefined;
  tooltip?: string;
}) => (
  <th
    className={
      "text-xs md:text-sm text-origin-white/60 px-2 first:pl-3 last:pr-3 md:first:pl-8 md:last:pr-4 py-2"
    }
  >
    <div className={twMerge("flex items-center gap-2", className)}>
      {children}
      {tooltip && (
        <Tooltip tooltipClassName="whitespace-nowrap" info={tooltip} />
      )}
    </div>
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
