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
import { ExternalLinkButton } from "../../components/ExternalLinkButton";
import moment from "moment";

const YieldSources = ({
  strategiesLatest,
  strategyHistory,
}: {
  strategiesLatest: DailyYield[];
  strategyHistory: Record<string, DailyYield[]>;
}) => {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const isSmall = width < 600;
  const totalBalance = strategiesLatest.reduce(
    (sum, next) => sum + BigInt(next.balance),
    BigInt(0),
  );
  const dateSpanSource = Object.values(strategyHistory)[0];
  const from = moment(dateSpanSource[0].timestamp).format("MMM D, YYYY");
  const to = moment(dateSpanSource[dateSpanSource.length - 1].timestamp).format(
    "MMM D, YYYY",
  );

  return (
    <>
      <Typography.Body className="text-xl mt-14">Yield Sources</Typography.Body>
      <Typography.Body3 className="mt-4 mb-6 text-xs text-table-title">
        Yield is measured from a variety of sources prior to entering the
        Dripper. These earnings will be distributed steadily in the future.
      </Typography.Body3>
      <Container className="mt-3" ref={ref}>
        {/* Header */}
        <div
          className={twMerge(
            "grid py-4 border-b border-black",
            isSmall
              ? "grid-cols-[6fr_2fr_2fr_28px]"
              : "grid-cols-[6fr_2fr_minmax(120px,_2fr)_2fr_2fr_78px]",
          )}
        >
          <Header className="justify-start">Strategy</Header>
          <Header className="justify-end" tooltip={!isSmall && `APY on ${to}`}>
            APY
          </Header>
          <Header
            className={twMerge("justify-end", isSmall ? "hidden" : "flex")}
            tooltip={`${from} through ${to}`}
          >
            30d trend
          </Header>
          <Header
            className="justify-end"
            tooltip={!isSmall && `Earnings on ${to}`}
          >
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
                  <>
                    {strategyInfo.icons.map((icon, i) => (
                      <img
                        src={icon}
                        alt={`icon-${i}`}
                        width={32}
                        height={32}
                        className={twMerge(
                          isSmall ? "hidden" : "",
                          i > 0 ? "-ml-4" : "",
                          "min-w-[32px] min-h-[32px]",
                        )}
                      />
                    ))}
                    <div
                      className={twMerge("truncate", !isSmall ? "ml-4" : "")}
                    >
                      <div className="truncate">{strategyName}</div>
                      <div className="text-sm text-origin-white/50">
                        {strategyInfo.protocol}
                      </div>
                    </div>
                  </>,
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
                  isSmall ? (
                    <Image
                      src={assetRootPath("/images/ext-link-white.svg")}
                      width="14"
                      height="14"
                      alt="ext-link"
                      className={twMerge(
                        "inline min-w-[8px] min-h-[8px] ",
                        "w-[8px] h-[8px]",
                      )}
                    />
                  ) : (
                    <ExternalLinkButton
                      className="h-8 w-full flex items-center justify-center"
                      href={`/proof-of-yield/${day}/${strategyPath}`}
                      icon={false}
                    >
                      <Image
                        src={assetRootPath("/images/arrow-right.svg")}
                        width="7"
                        height="10"
                        alt="arrow-right"
                      />
                    </ExternalLinkButton>
                  ),
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
      "flex items-center gap-1.5 text-xs md:text-sm text-origin-white/60 px-2 first:pl-3 last:px-3 md:first:pl-6 md:last:px-4 py-2",
      className,
    )}
  >
    {children}
    {tooltip && (
      <Tooltip
        tooltipClassName="whitespace-nowrap text-center"
        info={tooltip}
      />
    )}
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
      "py-4 grid border-b border-black hover:bg-white/5 cursor-pointer",
      isSmall
        ? "grid-cols-[6fr_2fr_2fr_28px]"
        : "grid-cols-[6fr_2fr_minmax(120px,_2fr)_2fr_2fr_78px]",
    )}
    href={href}
  >
    {elements.map((element, i) => (
      <div
        key={i}
        className={twMerge(
          "flex items-center truncate text-sm md:text-base text-origin-white px-2 first:pl-3 last:pr-3 md:first:pl-6 md:last:px-4 py-2 h-12",
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
