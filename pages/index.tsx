import moment from "moment";
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
  fetchApyHistory,
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
  strategiesCollateral,
  collateral,
  seo,
  navLinks,
}: IndexPageProps) => {
  const apyOptions = apy;
  const daysToApy = zipObject(apyDayOptions, apyOptions);

  return (
    <>
      <Head>
        <title>Origin Ether (OETH)</title>
      </Head>
      <Seo seo={seo} />

      <Header mappedLinks={navLinks} background="bg-origin-bg-black" />

      <Hero
        apy={get(daysToApy, "30") ? get(daysToApy, "30") : 0}
        tvl={tvl}
        tvlUsd={tvlUsd}
      />

      <Wallet />

      <Apy daysToApy={daysToApy} apyData={apyHistory} />

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

export async function getStaticProps() {
  const apyHistoryData = await fetchApyHistory();
  const allocation = await fetchAllocation();
  const apy = await fetchApy();
  const collateral = await fetchCollateral();
  const faqRes: { data: FaqData[] } = await fetchAPI("/oeth-faqs");
  const ogvStats = await fetchOgvStats();
  const navRes = await fetchAPI("/oeth-nav-links", {
    populate: {
      links: {
        populate: "*",
      },
    },
  });
  const seoRes = await fetchAPI("/oeth/page/en/%2F");

  let apyHistory = {};

  Object.keys(apyHistoryData).map((key) => {
    apyHistory[key] = apyHistoryData[key].filter((item) =>
      moment(item.day).isAfter("2023-05-06")
    );
  });

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
      apyHistory,
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
