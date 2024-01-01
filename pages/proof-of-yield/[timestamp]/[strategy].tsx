import { Link } from "../../../types";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button, GradientButton, Header, Section } from "../../../components";
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

const YieldSourceStrategy = ({
  navLinks,
  strategy,
}: {
  navLinks: Link[];
  strategy: StrategyInfo;
}) => {
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
        <title>Yield Source - {strategy.name}</title>
      </Head>

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      <div className="mx-4 md:mx-12 lg:mx-24">
        <div className="grid md:grid-cols-[2fr_1fr] gap-4 md:gap-8">
          <Container className="px-4 h-16 flex flex-row items-center">
            <GradientButton small href={`/proof-of-yield/${timestamp}`}>
              {"<"}
            </GradientButton>
            <div className="ml-4">{`Back to ${timestampMoment.format(
              "ll",
            )}`}</div>
          </Container>
          <div className="flex flex-col gap-4 md:gap-8">
            <Container>
              <ContainerHeader>Protocol</ContainerHeader>
              <ContainerBody>{strategy.protocol}</ContainerBody>
            </Container>
            <Container>
              <ContainerHeader>Collateral</ContainerHeader>
              <ContainerBody>{strategy.assetName}</ContainerBody>
            </Container>
          </div>
        </div>
      </div>
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
    },
    revalidate: 300, // 5 minutes
  };
};

export default YieldSourceStrategy;
