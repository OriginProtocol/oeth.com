import React from "react";
import Head from "next/head";
import moment, { Moment } from "moment";
import { get } from "lodash";
import { useRouter } from "next/router";
import { DayBasicData } from "../../sections";
import { DailyStat, YieldOnDayProps } from "../../types";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { fetchAPI, fetchProofOfYieldByDay, transformLinks } from "../../utils";
import { Header, Footer } from "../../components";
import Error from "../404";
import { fetchDailyYields } from "../../queries/fetchDailyYields";

const overrideCss = "px-8 md:px-10 lg:px-10 xl:px-[8.375rem]";

const YieldOnDay = ({
  navLinks,
  dailyStat,
  strategiesLatest,
  strategyHistory,
}: YieldOnDayProps) => {
  const router = useRouter();
  const { timestamp } = router.query;

  let timestampMoment: Moment;

  try {
    timestampMoment = moment(timestamp);
  } catch (err) {
    return <Error navLinks={navLinks} />;
  }

  return (
    <>
      <Head>
        <title>Proof of Yield</title>
      </Head>

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      <DayBasicData
        timestamp={timestampMoment}
        dailyStat={dailyStat}
        sectionOverrideCss={overrideCss}
        strategiesLatest={strategiesLatest}
        strategyHistory={strategyHistory}
      />

      {/* <DayDripperBanner sectionOverrideCss={overrideCss} />

      <DayStrategyPerformance sectionOverrideCss={overrideCss} />

      <DayOtherSources sectionOverrideCss={overrideCss} />

      <DayTotal sectionOverrideCss={overrideCss} /> */}

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

  const paths = dates.map((date) => ({
    params: { timestamp: date },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ timestamp: string }>,
): Promise<{
  props: YieldOnDayProps;
  revalidate: number;
}> => {
  const { timestamp } = context.params;

  let dailyStat: DailyStat = {
    date: "0",
    yield: "0",
    fees: "0",
    backing_supply: "0",
    rebasing_supply: "0",
    non_rebasing_supply: "0",
    apy: "0",
    raw_apy: "0",
    apy_boost: "0",
    rebase_events: [],
  };

  if (timestamp && typeof timestamp === "string") {
    const dailyStats = await fetchProofOfYieldByDay(timestamp);
    if (Array.isArray(dailyStats) && dailyStats.length > 0) {
      dailyStat = get(dailyStats, `[${dailyStats?.length - 1}]`) || null;
    }
  }

  const navRes = await fetchAPI("/oeth-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });

  const navLinks = transformLinks(navRes.data);
  const dailyYields = await fetchDailyYields(new Date(timestamp));

  return {
    props: {
      navLinks,
      dailyStat,
      strategiesLatest: dailyYields.latest,
      strategyHistory: dailyYields.history,
    },
    revalidate: 60 * 60 * 12, // revalidate every 12 hours
  };
};

export default YieldOnDay;
