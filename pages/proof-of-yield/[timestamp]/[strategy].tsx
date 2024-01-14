import { Link } from "../../../types";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Button,
  Footer,
  GradientButton,
  Header,
  Section,
} from "../../../components";
import React, { useMemo, useState } from "react";
import moment, { Moment } from "moment/moment";
import Error from "../../404";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { assetRootPath, fetchAPI, transformLinks } from "../../../utils";
import { Container } from "../../../components/Container";
import {
  strategies,
  StrategyInfo,
} from "../../../sections/proof-of-yield/utils/strategies";
import { ContainerHeader } from "../../../components/ContainerHeader";
import { ContainerBody } from "../../../components/ContainerBody";
import { ExternalLinkButton } from "../../../components/ExternalLinkButton";
import LineBarChart from "../../../components/LineBarChart";
import { fetchDailyYields } from "../../../queries/fetchDailyYields";
import { formatEther } from "viem";
import Image from "next/image";
import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { TimeUnit } from "chart.js";
import Tooltip from "../../../components/proof-of-yield/Tooltip";
import * as dn from "dnum";

const sma = (days: number) => {
  const periods = [];
  return (val: number) => {
    periods.push(val);
    if (periods.length > days) periods.shift();
    return periods.reduce((sum, val) => sum + val, 0) / periods.length;
  };
};

const YieldSourceStrategy = ({
  navLinks,
  strategyPath,
}: {
  navLinks: Link[];
  strategyPath: string;
}) => {
  const router = useRouter();
  const { timestamp } = router.query;
  let timestampMoment: Moment;

  const strategy = strategies.find((s) => s.path === strategyPath);
  const [{ days, smoothingDays }, setState] = useState({
    days: 180,
    smoothingDays: 30,
  });

  // We do not pull the current day.
  const dailyYields = useQuery(
    `fetchDailyYields-${days}-${smoothingDays}`,
    () =>
      fetchDailyYields(
        moment
          .utc()
          .startOf("day")
          .subtract(days + smoothingDays, "days")
          .toDate(),
        moment.utc().endOf("day").add(999, "day").toDate(),
      ),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );
  try {
    timestampMoment = moment(timestamp);
  } catch (err) {
    return <Error navLinks={navLinks} />;
  }

  if (!dailyYields.data && !dailyYields.isFetching) {
    return <Error navLinks={navLinks} />;
  }

  const calcSma = sma(smoothingDays);
  const data = dailyYields.data;
  const totalBalance = data?.latest.reduce(
    (sum, next) => sum + BigInt(next.balance),
    BigInt(0),
  );
  const historyBase = data?.history[strategy.key] ?? [];
  const history = useMemo(() => {
    return historyBase
      ?.map((data) => ({
        ...data,
        apySMA: calcSma(data.apy),
      }))
      .slice(historyBase.length - days, historyBase.length);
  }, [historyBase]);

  const latestDailyYield = history?.[history.length - 1];
  const latestDailyYieldDay = latestDailyYield?.timestamp.slice(0, 10);

  const previousDailyYield = history?.[history.length - 2];
  const previousDailyYieldDay = previousDailyYield?.timestamp.slice(0, 10);

  const allocation = latestDailyYield?.balance;
  const apy = previousDailyYield?.apy;
  const earnings = latestDailyYield?.earnings;

  return (
    <>
      <Head>
        <title>Yield Source - {strategy.name}</title>
      </Head>

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      <div className="mx-4 md:mx-12 lg:mx-24">
        <div className="xl:grid xl:grid-cols-[2fr_1fr] gap-4 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-8">
            <Container className="px-4 h-16 flex flex-row items-center">
              <GradientButton
                small
                href={`/proof-of-yield/${timestamp}`}
                className="h-7 w-10 flex items-center justify-center"
              >
                <Image
                  src={assetRootPath("/images/arrow-left.svg")}
                  width="7"
                  height="10"
                  alt="arrow-left"
                  style={{ marginLeft: -2 }}
                />
              </GradientButton>
              <div className="ml-4">{`Back to ${timestampMoment.format(
                "ll",
              )}`}</div>
            </Container>
            <Container>
              <ContainerHeader small>Strategy</ContainerHeader>
              <ContainerBody className="pb-4">
                <div className="mb-4">
                  <div className="flex items-center text-3xl">
                    {strategy.name}
                  </div>
                </div>
                <ExternalLinkButton
                  href={`https://etherscan.io/address/${strategy.address}`}
                  children={"Contract"}
                />
              </ContainerBody>
              <ContainerBody
                padding={false}
                className="grid grid-cols-3 divide-x-2 divide-black border-t-2 border-t-black"
              >
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="flex items-center text-sm leading-8">
                    Allocation
                    <Tooltip
                      info={`Allocation on ${latestDailyYieldDay}`}
                      className="mx-2"
                      tooltipClassName="whitespace-nowrap text-center"
                    />
                  </div>
                  <div className="flex flex-wrap justify-center font-bold text-lg md:text-2xl leading-[32px] md:leading-[48px]">
                    {allocation === undefined ? (
                      <div className="flex items-center h-[48px]">
                        <div className="horizontal-loader" />
                      </div>
                    ) : (
                      Number(formatEther(BigInt(allocation))).toLocaleString(
                        "en-US",
                        {
                          notation: "compact",
                          minimumFractionDigits: 3,
                          maximumFractionDigits: 3,
                        },
                      )
                    )}
                    {allocation && (
                      <span className="font-normal ml-2 text-origin-white/70">
                        (
                        {`${dn.format(
                          dn.mul(dn.div(allocation, totalBalance, 18), 100),
                          {
                            digits: 1,
                            trailingZeros: true,
                          },
                        )}%`}
                        )
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="flex items-center text-sm leading-8">
                    APY
                    <Tooltip
                      info={`APY on ${previousDailyYieldDay}`}
                      className="mx-2"
                      tooltipClassName="whitespace-nowrap text-center"
                    />
                  </div>

                  <div className="font-bold text-lg md:text-2xl leading-[32px] md:leading-[48px]">
                    {apy === undefined ? (
                      <div className="flex items-center h-[48px]">
                        <div className="horizontal-loader" />
                      </div>
                    ) : (
                      `${(apy * 100).toFixed(1)}%`
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="flex justify-center items-center text-center text-sm leading-8">
                    Lifetime earnings
                    <Tooltip
                      info={`Lifetime earnings as of ${latestDailyYieldDay}`}
                      className="mx-2"
                      tooltipClassName="whitespace-nowrap text-center"
                    />
                  </div>
                  <div className="font-bold text-lg md:text-2xl leading-[32px] md:leading-[48px]">
                    {earnings === undefined ? (
                      <div className="flex items-center h-[48px]">
                        <div className="horizontal-loader" />
                      </div>
                    ) : (
                      Number(formatEther(BigInt(earnings))).toLocaleString(
                        "en-US",
                        {
                          notation: "compact",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )
                    )}
                  </div>
                </div>
              </ContainerBody>
            </Container>
            <div className="xl:hidden flex flex-col gap-4 md:gap-8">
              <StrategyInfo strategy={strategy} />
            </div>
            <Container>
              <ContainerHeader small>Earnings</ContainerHeader>
              <ContainerBody padding={false}>
                <div className="flex flex-col-reverse md:flex-row md:items-center justify-between px-4 md:px-6 mb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <span>
                      <div
                        className="inline-block rounded-full w-3 h-3 mr-2"
                        style={{ backgroundColor: "#48E4DB" }}
                      />
                      APY
                    </span>
                    <span>
                      <div
                        className="inline-block rounded-full w-3 h-3 mr-2"
                        style={{ backgroundColor: "#586CF8" }}
                      />
                      Earnings
                    </span>
                  </div>
                  <div className="flex flex-row flex-wrap justify-between md:justify-start md:flex-col gap-2 items-end">
                    <div className="flex border border-origin-white/10 rounded-full">
                      {[
                        { label: "1w", value: 7 },
                        { label: "1m", value: 30 },
                        { label: "6m", value: 180 },
                        { label: "1yr", value: 365 },
                        { label: "All", value: Infinity },
                      ].map((option) => (
                        <div
                          className={twMerge(
                            "cursor-pointer hover:bg-origin-white/10 rounded-full h-9 text-sm flex items-center justify-center w-10 sm:w-16",
                            option.value === days ? "bg-origin-white/10" : "",
                          )}
                          onClick={() =>
                            setState({
                              days: option.value,
                              smoothingDays,
                            })
                          }
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                    <div className="relative flex items-center">
                      <Image
                        src={assetRootPath(`/images/caret.svg`)}
                        width="12"
                        height="8"
                        className={`absolute right-4`}
                        alt="caret"
                      />
                      <select
                        onChange={(e) =>
                          setState({
                            days,
                            smoothingDays: Number(e.currentTarget.value),
                          })
                        }
                        className="hidden md:block cursor-pointer hover:bg-origin-white/10 h-9 pl-4 pr-10 bg-origin-bg-grey border border-origin-white/10 rounded-full appearance-none outline-origin-blue"
                      >
                        <option selected={smoothingDays === 1} value={1}>
                          No trailing average
                        </option>
                        <option selected={smoothingDays === 7} value={7}>
                          7-day trailing average
                        </option>
                        <option selected={smoothingDays === 14} value={14}>
                          14-day trailing average
                        </option>
                        <option selected={smoothingDays === 30} value={30}>
                          30-day trailing average
                        </option>
                      </select>
                      <select
                        onChange={(e) =>
                          setState({
                            days,
                            smoothingDays: Number(e.currentTarget.value),
                          })
                        }
                        className="md:hidden cursor-pointer hover:bg-origin-white/10 h-9 pl-4 pr-10 bg-origin-bg-grey border border-origin-white/10 rounded-full appearance-none outline-origin-blue"
                      >
                        <option selected={smoothingDays === 1} value={1}>
                          1-day
                        </option>
                        <option selected={smoothingDays === 7} value={7}>
                          7-day
                        </option>
                        <option selected={smoothingDays === 14} value={14}>
                          14-day
                        </option>
                        <option selected={smoothingDays === 30} value={30}>
                          30-day
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="md:pb-3 md:pr-3 h-96">
                  <LineBarChart
                    dates={history.map((dy) => dy.timestamp.slice(0, 10))}
                    dateTimeScaleOptions={{
                      unit:
                        ({
                          7: "day",
                          30: "day",
                          180: "month",
                          365: "month",
                          Infinity: "month",
                        }[days] as TimeUnit) ?? "day",
                    }}
                    bars={history.map((dy) =>
                      Number(formatEther(BigInt(dy.earningsChange))),
                    )}
                    barLabel={"Earnings"}
                    barColor={"#586CF8"}
                    lines={history.map((dy) => dy.apySMA)}
                    lineLabel={"APY"}
                    lineColor={"#48E4DB"}
                    lineFormat={(percentage: number) =>
                      `${(percentage * 100).toFixed(1)}%`
                    }
                    tooltip={{
                      usePointStyle: true,
                      callbacks: {
                        beforeBody: (context) => {
                          const { dataIndex } = context[0];
                          return `Allocation: Ξ${Number(
                            formatEther(BigInt(history[dataIndex].balance)),
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                          })}`;
                        },
                        label: (context) => {
                          const { dataset, raw } = context;
                          const value = Number(raw);
                          if (dataset.label === "APY") {
                            return ` ${dataset.label}: ${(value * 100).toFixed(
                              1,
                            )}%`;
                          } else {
                            return ` ${dataset.label}: Ξ${value.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 4,
                              },
                            )}`;
                          }
                        },
                        labelColor: (context) => {
                          const { dataset, raw } = context;
                          if (dataset.label === "APY") {
                            return {
                              backgroundColor: "#48E4DB",
                              borderColor: "#48E4DB",
                            };
                          } else {
                            return {
                              backgroundColor: "#586CF8",
                              borderColor: "#586CF8",
                            };
                          }
                        },
                      },
                    }}
                  />
                </div>
              </ContainerBody>
            </Container>
            <Container>
              <ContainerHeader className="font-normal">
                How yield is generated
              </ContainerHeader>
              <ContainerBody className="text-origin-white/70">
                {strategy.yieldDescription}
              </ContainerBody>
            </Container>
          </div>
          <div className="hidden xl:flex flex-col gap-4 md:gap-8">
            <StrategyInfo strategy={strategy} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const StrategyInfo = ({ strategy }: { strategy: StrategyInfo }) => {
  return (
    <>
      <Container>
        <ContainerHeader small>Protocol</ContainerHeader>
        <ContainerBody className="flex items-center justify-between">
          {strategy.protocol}
          <ExternalLinkButton
            href={strategy.protocolHref}
            children={"Website"}
          />
        </ContainerBody>
      </Container>
      <Container>
        <ContainerHeader small>Collateral</ContainerHeader>
        <ContainerBody className="flex items-center justify-between">
          <div>
            {strategy.assetName}
            {strategy.assetSymbol && (
              <span className="text-origin-white/70">
                {` (${strategy.assetSymbol})`}
              </span>
            )}
          </div>
          <ExternalLinkButton href={strategy.assetHref} children={"Contract"} />
        </ContainerBody>
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const today = moment().startOf("day");
  // Last 30 days excluding the current day
  const dates = Array.from({ length: 30 }, (_, i) =>
    moment(today)
      .subtract(i + 1, "days")
      .format("YYYY-MM-DD"),
  );

  const paths = strategies.flatMap((strategy) =>
    dates.map((date) => ({
      params: {
        timestamp: date,
        strategy: strategy.path,
      },
    })),
  );

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ timestamp: string; strategy: string }>,
): Promise<{
  props: React.ComponentProps<typeof YieldSourceStrategy>;
  revalidate: number;
}> => {
  const { timestamp, strategy } = context.params;

  const navRes = await fetchAPI("/oeth-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });
  const navLinks = transformLinks(navRes.data);

  return {
    props: {
      navLinks,
      strategyPath: strategy,
    },
    revalidate: 300, // 5 minutes
  };
};

export default YieldSourceStrategy;
