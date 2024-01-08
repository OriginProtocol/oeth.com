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
import React from "react";
import moment, { Moment } from "moment/moment";
import Error from "../../404";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { fetchAPI, transformLinks } from "../../../utils";
import { Container } from "../../../components/Container";
import {
  strategies,
  StrategyInfo,
} from "../../../sections/proof-of-yield/utils/strategies";
import { ContainerHeader } from "../../../components/ContainerHeader";
import { ContainerBody } from "../../../components/ContainerBody";
import { ExternalLinkButton } from "../../../components/ExternalLinkButton";
import LineBarChart from "../../../components/LineBarChart";
import {
  DailyYield,
  fetchDailyYields,
} from "../../../queries/fetchDailyYields";
import { formatEther, parseEther } from "viem";
import { BigNumber } from "ethers";
import { startOfDay, subDays } from "date-fns";

const YieldSourceStrategy = ({
  navLinks,
  strategy,
  dailyYields,
  latestDailyYield,
}: {
  navLinks: Link[];
  strategy: StrategyInfo;
  dailyYields: { latest: DailyYield[]; history: Record<string, DailyYield[]> };
  latestDailyYield: DailyYield;
}) => {
  const router = useRouter();
  const { timestamp } = router.query;

  let timestampMoment: Moment;

  const history = dailyYields.history[strategy.key];

  try {
    timestampMoment = moment(timestamp);
  } catch (err) {
    return <Error navLinks={navLinks} />;
  }

  return (
    <>
      <Head>
        <title>Yield Source - {strategy.name}</title>
      </Head>

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      <div className="mx-4 md:mx-12 lg:mx-24">
        <div className="grid xl:grid-cols-[2fr_1fr] gap-4 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-8">
            <Container className="px-4 h-16 flex flex-row items-center">
              <GradientButton small href={`/proof-of-yield/${timestamp}`}>
                {"<"}
              </GradientButton>
              <div className="ml-4">{`Back to ${timestampMoment.format(
                "ll",
              )}`}</div>
            </Container>
            <Container>
              <ContainerHeader small>Strategy</ContainerHeader>
              <ContainerBody>
                <div className="text-3xl mb-6">{strategy.name}</div>
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
                  <div className="text-sm leading-8">Current allocation</div>
                  <div className="font-bold text-lg md:text-2xl leading-[32px] md:leading-[48px]">
                    {Number(
                      formatEther(BigInt(latestDailyYield.balance)),
                    ).toLocaleString("en-US", {
                      notation: "compact",
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                    {/*<span className="text-origin-white/70">(7.62%)</span>*/}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="text-sm leading-8">Current APY</div>
                  <div className="font-bold text-lg md:text-2xl leading-[32px] md:leading-[48px]">
                    {(latestDailyYield.apy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="text-sm leading-8">Lifetime earnings</div>
                  <div className="font-bold text-lg md:text-2xl leading-[32px] md:leading-[48px]">
                    {Number(
                      formatEther(BigInt(latestDailyYield.earnings)),
                    ).toLocaleString("en-US", {
                      notation: "compact",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </ContainerBody>
            </Container>
            <Container>
              <ContainerHeader small>Earnings</ContainerHeader>
              <ContainerBody padding={false}>
                <LineBarChart
                  data={{
                    dates: history.map((dy) => dy.timestamp.slice(0, 10)),
                    earnings: history.map((dy) =>
                      Number(formatEther(BigInt(dy.earningsChange))),
                    ),
                    apy: history.map((dy) => dy.apy),
                  }}
                />
              </ContainerBody>
            </Container>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
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
                <ExternalLinkButton
                  href={strategy.assetHref}
                  children={"Contract"}
                />
              </ContainerBody>
            </Container>
          </div>
        </div>
      </div>

      <Footer />
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
  const strategyInfo = strategies.find((s) => s.path === strategy);

  const dailyYields = await fetchDailyYields(new Date(timestamp), 30 * 6);
  const latestDailyYields = await fetchDailyYields(
    startOfDay(subDays(new Date(), 1)),
    1,
    [strategy],
  );

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
      strategy: strategyInfo,
      dailyYields,
      latestDailyYield: latestDailyYields.latest[0],
    },
    revalidate: 300, // 5 minutes
  };
};

export default YieldSourceStrategy;
