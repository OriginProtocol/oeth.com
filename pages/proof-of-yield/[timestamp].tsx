import Head from "next/head";
import React from "react";
import Error from "../404";
import moment from "moment";
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
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { fetchAPI, fetchDailyStats, transformLinks } from "../../utils";
import { Header, Footer } from "../../components";

const overrideCss = "px-8 md:px-10 lg:px-10 xl:px-[8.375rem]";

const YieldOnDay = ({ navLinks, dailyStat }: YieldOnDayProps) => {
  const router = useRouter();
  let { timestamp } = router.query;

  const timestampNumber = Number(timestamp as any);

  if (Number.isNaN(timestampNumber)) return <Error navLinks={navLinks} />;

  return (
    <>
      <Head>
        <title>Proof of Yield</title>
      </Head>

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      <DayBasicData
        timestamp={timestampNumber}
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<{ timestamp: string }>
): Promise<{
  props: YieldOnDayProps;
}> => {
  const { timestamp } = context.query;

  let dailyStat: DailyStat;
  if (timestamp && typeof timestamp === "string" && parseInt(timestamp)) {
    let timestampNumber = parseInt(timestamp);
    const daysAgo = moment().diff(moment(timestampNumber), "days");
    const dailyStats = await fetchDailyStats(daysAgo, daysAgo - 1);
    dailyStat = get(dailyStats, `[${dailyStats.length - 1}]`); // At daysAgo = 1, the array returns both current day and last day
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
  };
};

export default YieldOnDay;
