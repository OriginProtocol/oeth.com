import React from "react";
import classnames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { cloneDeep, groupBy, orderBy } from "lodash";
import { Typography } from "@originprotocol/origin-storybook";
import {
  Button,
  ErrorBoundary,
  LayoutBox,
  TwoColumnLayout,
  ProgressBar,
} from "../../components";
import { fetchAllocation } from "../../utils/api";
import { strategyMapping, protocolMapping } from "../../constants";
import { formatCurrency } from "../../utils/math";

const YieldSourceBreakdown = ({ data, total }) => (
  <div className="flex flex-col lg:flex-row flex-wrap lg:items-center gap-0 lg:gap-4">
    {data.map(({ icon, name, total: currentTotal }) => {
      return (
        <div
          key={name}
          className="flex flex-row items-center space-x-3 h-[40px]"
        >
          <Image src={icon} height={24} width={24} alt={name} />
          <Typography.Caption>{name}</Typography.Caption>
          <Typography.Caption className="text-subheading">
            {((currentTotal / total) * 100).toFixed(2)}%
          </Typography.Caption>
        </div>
      );
    })}
  </div>
);

const LookingForYield = () => {
  return (
    <LayoutBox>
      <div className="flex flex-col space-y-6 p-8">
        <Typography.Body>
          Looking for a full breakdown of where the yield comes from?
        </Typography.Body>
        <Typography.Body2 className="text-subheading text-sm">
          OUSD’s yield is transparent, real and 100% verifiable on-chain. See
          the evidence of OUSD’s consistent performance over the past X days.
        </Typography.Body2>
        <footer>
          <a
            href="https://www.ousd.com/ogv-dashboard"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              append={
                <Image
                  src="/images/ext-link-white.svg"
                  height={16}
                  width={16}
                  alt="External link icon"
                />
              }
            >
              <Typography.Body2>View OETH Proof of Yield</Typography.Body2>
            </Button>
          </a>
        </footer>
      </div>
    </LayoutBox>
  );
};

const AnalyticsStrategies = ({ protocols, total }) => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Strategies</title>
      </Head>
      <div className="grid grid-cols-12 gap-6">
        {protocols.map(({ name, strategies, total: strategyTotal }) => {
          const { image, description, color } = protocolMapping[name] || {};
          if (!description) return null;
          return (
            <LayoutBox key={name} className="col-span-12">
              <div className="flex flex-col items-start space-y-6 p-8 w-full">
                <div className="flex justify-between w-full">
                  <div
                    className={classnames("relative", {
                      "w-1/3 lg:w-1/4": name !== "Vault",
                      "w-fit": name === "Vault",
                    })}
                  >
                    {name !== "Vault" ? (
                      <Image
                        src={image}
                        fill
                        sizes="(max-width: 768px) 64px, 128px"
                        style={{
                          objectFit: "contain",
                          objectPosition: "0%",
                        }}
                        alt={name}
                      />
                    ) : (
                      <Typography.Body>Unallocated</Typography.Body>
                    )}
                  </div>
                  <div className="flex flex-row space-x-2">
                    <Typography.Body className="text-subheading">
                      Ξ {formatCurrency(strategyTotal, 2)}
                    </Typography.Body>
                    <Typography.Body>
                      ({((strategyTotal / total) * 100).toFixed(2)}%)
                    </Typography.Body>
                  </div>
                </div>
                <ProgressBar
                  color={color}
                  numerator={(strategyTotal / total) * 100}
                  denominator={100}
                />
                <YieldSourceBreakdown data={strategies} total={total} />
                <Typography.Caption className="text-subheading">
                  {description}
                </Typography.Caption>
              </div>
            </LayoutBox>
          );
        })}
        {/*<div className="col-span-12">*/}
        {/*  <LookingForYield />*/}
        {/*</div>*/}
      </div>
    </ErrorBoundary>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props;
}> => {
  const { strategies } = await fetchAllocation();

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

  // Split strategies into separate yield sources by token
  const yieldSources = Object.keys(strategies)
    .flatMap((strategy) => {
      if (strategyMapping[strategy]?.vault) {
        return Object.keys(strategies[strategy]?.holdings_value).map(
          (token) => {
            return {
              name: token,
              protocol: strategyMapping[strategy]?.protocol,
              total: strategies[strategy]?.holdings_value[token],
              icon: strategyMapping[strategy]?.icons[token],
            };
          }
        );
      }
      return {
        name: strategyMapping[strategy]?.name,
        protocol: strategyMapping[strategy]?.protocol,
        total: Object.keys(strategies[strategy]?.holdings_value).reduce(
          (accum, key) => (accum += strategies[strategy]?.holdings_value[key]),
          0
        ),
        icon: strategyMapping[strategy]?.icon,
      };
    })
    .filter((strategy) => {
      return strategy;
    });

  // group by protocol
  const protocols = groupBy(yieldSources, (source) => source.protocol);

  // sort protocol by total of underlying strategies
  const protocolsSorted = Object.keys(protocols)
    .map((protocol) => {
      return {
        name: protocol,
        strategies: protocols[protocol],
        // @ts-ignore
        total: protocols[protocol].reduce((t, s) => {
          return { total: t.total + s.total };
        }).total,
      };
    })
    .sort((a, b) => b.total - a.total);

  // @ts-ignore
  const sumTotal = (values) =>
    values.reduce((t, s) => {
      return { total: t.total + s.total };
    })?.total;

  return {
    props: {
      protocols: orderBy(
        Object.keys(protocols)?.map((protocol) => ({
          name: protocol,
          strategies: protocols[protocol],
          total: sumTotal(protocols[protocol]),
        })),
        "total",
        "desc"
      ),
      total: sumTotal(yieldSources),
    },
  };
};

export default AnalyticsStrategies;

AnalyticsStrategies.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
