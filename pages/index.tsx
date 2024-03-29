import { Header, Seo } from "../components";
import {
  Faq,
  Hero,
  Wallet,
  SecretSauce,
  Ogv,
  Apy,
  Allocation,
  Collateral,
  Security,
} from "../sections";
import {
  fetchAPI,
  fetchAllocation,
  fetchApy,
  fetchCollateral,
  fetchOgvStats,
  formatSeo,
  transformLinks,
} from "../utils";
import {
  ApyHistory,
  FaqData,
  Link as LinkType,
  OgvStats,
  Strategies,
  Collateral as CollateralType,
  Audit,
} from "../types";
import { Footer } from "../components";
import { cloneDeep, get, zipObject } from "lodash";
import { apyDayOptions, strategyMapping } from "../constants";
import Head from "next/head";

interface IndexPageProps {
  audits: Audit[];
  apy: number[];
  tvl: string;
  tvlUsd: string;
  revenueAllTime: number;
  apyHistory: ApyHistory;
  faq: FaqData[];
  stats: OgvStats;
  strategies: Strategies;
  strategiesCollateral: Strategies;
  collateral: CollateralType[];
  seo: any;
  navLinks: LinkType[];
}

const IndexPage = ({
  audits,
  apy,
  tvl,
  tvlUsd,
  apyHistory,
  faq,
  stats,
  strategies,
  seo,
  navLinks,
  revenueAllTime,
}: IndexPageProps) => {
  const apyOptions = apy;
  const daysToApy = zipObject(apyDayOptions, apyOptions);
  const targetApyDays = daysToApy[7] > daysToApy[30] ? 7 : 30;

  return (
    <>
      <Head>
        <title>Origin Ether (OETH)</title>
      </Head>
      <Seo seo={seo} />
      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />
      <Hero
        apy={get(daysToApy, targetApyDays) ? get(daysToApy, targetApyDays) : 0}
        apyDays={targetApyDays}
        tvl={tvl}
        tvlUsd={tvlUsd}
        revenueAllTime={revenueAllTime}
      />
      <Wallet />
      <Apy
        daysToApy={daysToApy}
        targetApyDays={targetApyDays}
        apyData={apyHistory}
      />
      <Allocation strategies={strategies} />
      <Collateral />
      <Security audits={audits} />
      <SecretSauce />
      <Ogv stats={stats} />
      <Faq faq={faq} />
      <Footer />
    </>
  );
};

export async function getStaticProps({ locale }) {
  if (locale !== "en") {
    return {
      notFound: true,
    };
  }

  const allocation = await fetchAllocation();
  const apy = await fetchApy();
  const collateral = await fetchCollateral();

  const ogvStats = await fetchOgvStats();
  const faqRes: { data: FaqData[] } = await fetchAPI("/oeth-faqs");
  const navRes = await fetchAPI("/oeth-nav-links", {
    populate: { links: { populate: "*" } },
  });
  const seoRes = await fetchAPI("/oeth/page/en/%2F");
  const auditsRes = await fetchAPI("/oeth-audits");
  const navLinks = transformLinks(navRes.data);
  const faqData = faqRes?.data.sort((a, b) => a.id - b.id) || [];

  //Extract rETH and stETH from vault holdings
  const strategiesCollateral = cloneDeep(allocation.strategies);
  const strategies = allocation.strategies;

  const holdings = cloneDeep(strategies["vault_holding"].holdings);
  const holdingsValue = cloneDeep(strategies["vault_holding"].holdings_value);

  strategies.r_eth_strat = {
    _address: strategyMapping["r_eth_strat"].address,
    holdings: {
      RETH: holdings["RETH"],
    },
    holdings_value: {
      RETH: holdingsValue["RETH"],
    },
    name: strategyMapping["r_eth_strat"].name,
    total: holdings["RETH"],
  };

  strategies.vault_holding.total -= holdings["RETH"];

  delete strategies["vault_holding"].holdings["RETH"];
  delete strategies["vault_holding"].holdings_value["RETH"];

  strategies.st_eth_strat = {
    address: strategyMapping["st_eth_strat"].address,
    holdings: {
      STETH: holdings["STETH"],
    },
    holdings_value: {
      RETH: holdingsValue["STETH"],
    },
    name: strategyMapping["st_eth_strat"].name,
    total: holdings["STETH"],
  };

  strategies.vault_holding.total -= holdings["STETH"];

  delete strategies["vault_holding"].holdings["STETH"];
  delete strategies["vault_holding"].holdings_value["STETH"];

  const audits = (auditsRes.data as Audit[]).sort((a, b) => a.id - b.id) || [];

  return {
    props: {
      audits,
      apy,
      tvl: allocation.total_supply,
      tvlUsd: allocation.total_value_usd,
      revenueAllTime: allocation.revenue_all_time,
      apyHistory: {},
      faq: faqData,
      stats: ogvStats,
      strategies,
      strategiesCollateral,
      collateral: collateral.collateral,
      seo: formatSeo(seoRes?.data),
      navLinks,
    },
    revalidate: 60 * 5,
  };
}

export default IndexPage;
