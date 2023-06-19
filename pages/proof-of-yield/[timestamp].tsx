import Head from "next/head";
import React, { useEffect } from "react";
import Error from "../404";
import moment, { Moment } from "moment";
import { get } from "lodash";
import { useRouter } from "next/router";
import {
  DayBasicData,
  DayDripperBanner,
  DayOtherSources,
  DayStrategyPerformance,
  DayTotal,
} from "../../sections";
import { DailyStat, YieldOnDayProps } from "../../types";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { fetchAPI, fetchDailyStats, transformLinks } from "../../utils";
import { Header, Footer } from "../../components";

const overrideCss = "px-8 md:px-10 lg:px-10 xl:px-[8.375rem]";

const YieldOnDay = ({ navLinks, dailyStat }: YieldOnDayProps) => {
  const router = useRouter();
  let { timestamp } = router.query;

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
      .format("YYYY-MM-DD")
  );

  const paths = dates.map((date) => ({
    params: { timestamp: date },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ timestamp: string }>
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
    const daysAgo = moment().diff(moment(timestamp), "days");
    const dailyStats = await fetchDailyStats(daysAgo, daysAgo - 1);
    if (Array.isArray(dailyStats) && dailyStats.length > 0)
      dailyStat = get(dailyStats, `[${dailyStats?.length - 1}]`); // At daysAgo = 1, the array returns both current day and last day
  }

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
      dailyStat,
    },
    revalidate: 60 * 60 * 12, // revalidate every 12 hours
  };
};

export default YieldOnDay;
