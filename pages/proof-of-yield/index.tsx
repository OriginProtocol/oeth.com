import Head from "next/head";
import React from "react";
import { Header, Seo } from "../../components";
import { GetServerSideProps, GetStaticProps } from "next";
import { fetchAPI, fetchDailyStats, transformLinks } from "../../utils";
import { Heading, DailyYield } from "../../sections";
import { Footer } from "../../components";
import { DailyStat, Link } from "../../types";

interface ProofOfYieldProps {
  navLinks: Link[];
  dailyStats: DailyStat[];
}

const ProofOfYield = ({ navLinks, dailyStats }: ProofOfYieldProps) => {
  return (
    <>
      <Head>
        <title>Proof of Yield</title>
      </Head>

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      {/* Heading */}
      <Heading />

      <DailyYield dailyStats={dailyStats} />

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: ProofOfYieldProps;
  revalidate: number;
}> => {
  const navRes = await fetchAPI("/oeth-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });
  const dailyStats = await fetchDailyStats(30);

  const navLinks = transformLinks(navRes.data);
  return {
    props: {
      navLinks,
      dailyStats,
    },
    revalidate: 60 * 5,
  };
};
export default ProofOfYield;
