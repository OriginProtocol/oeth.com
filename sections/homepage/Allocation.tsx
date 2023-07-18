import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Typography } from "@originprotocol/origin-storybook";
import LinearProgress from "@mui/material/LinearProgress";
import { ThemeProvider } from "@mui/material/styles";
import { formatCurrency, assetRootPath, camelifyLsd } from "../../utils";
import { theme, strategyMapping, protocolMapping } from "../../constants";
import { groupBy } from "lodash";
import { Strategies } from "../../types";
import { GradientButton } from "../../components";

interface AllocationProps {
  strategies: Strategies;
}

const Allocation = ({ strategies }: AllocationProps) => {
  const [open, setOpen] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // split strategies into separate yield sources by token
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
  const total = yieldSources?.reduce((t, s) => {
    return { total: t.total + s.total };
  }).total;

  return (
    <>
      <section className="black">
        <div className="px-[16px] md:px-[64px] lg:px-[134px] py-14 md:py-[120px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 500 }}
          >
            Fully transparent on Ethereum
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto !leading-[23px] md:!leading-[28px] text-subheading text-sm md:text-base">
            Yield is generated from a short list of conservative strategies and
            verifiable on-chain.
          </Typography.Body3>
          <div className="allocation max-w-[1432px] mx-auto mt-10 md:mt-20 mb-10 md:mb-20 rounded-xl divide-black divide-y-[1px] md:divide-y-2">
            <Typography.H7 className="font-bold px-4 py-[22px] md:p-10">
              Current yield sources & allocations
            </Typography.H7>
            <div>
              <Typography.H7
                className="flex flex-row justify-between mt-4 md:mt-10 px-8 md:px-[72px] text-subheading"
                style={{ fontWeight: 400, lineHeight: "20px" }}
              >
                <div className="text-[14px] md:text-[16px]">Yield source</div>
                <div className="text-[14px] md:text-[16px]">Allocation</div>
              </Typography.H7>
              <div className="flex flex-col px-[16px] md:px-10 pt-2 pb-[10px] md:pt-3 md:pb-8">
                <ThemeProvider theme={theme}>
                  <div className="flex flex-col justify-between">
                    {loaded &&
                      protocolsSorted?.map((protocol, i) => {
                        if (protocol.name == "undefined") return;
                        return (
                          <div
                            className="strategy rounded-xl border-2 p-[16px] md:p-8 my-[6px] md:my-[8px]"
                            key={i}
                            onClick={(e) => {
                              e.preventDefault();
                              setOpen({
                                ...open,
                                [protocol.name]: !open[protocol.name],
                              });
                            }}
                          >
                            <div>
                              <div className="flex flex-row justify-between">
                                <div
                                  className={`relative ${
                                    protocol.name !== "Vault"
                                      ? "w-1/3 lg:w-1/4"
                                      : "w-fit"
                                  }`}
                                >
                                  {protocol.name !== "Vault" ? (
                                    <Image
                                      src={
                                        protocolMapping[protocol.name]?.image
                                      }
                                      fill
                                      sizes="(max-width: 768px) 64px, 128px"
                                      style={{
                                        objectFit: "contain",
                                        objectPosition: "0%",
                                      }}
                                      alt={protocol.name}
                                    />
                                  ) : (
                                    <Typography.Body>
                                      Unallocated
                                    </Typography.Body>
                                  )}
                                </div>
                                <div>
                                  <Typography.H7
                                    className="inline items-center text-[12px] md:text-[24px] text-subheading"
                                    style={{ fontWeight: 400 }}
                                  >{`${formatCurrency(
                                    protocol.total,
                                    2
                                  )}`}</Typography.H7>
                                  <Typography.H7
                                    className="inline pl-[8px] text-[12px] md:text-[24px]"
                                    style={{ fontWeight: 700 }}
                                  >{`(${formatCurrency(
                                    (protocol.total / total) * 100,
                                    2
                                  )}%)`}</Typography.H7>
                                </div>
                              </div>
                              <LinearProgress
                                variant="determinate"
                                value={(protocol.total / total) * 100}
                                // @ts-ignore
                                color={protocol.name}
                                sx={{
                                  bgcolor: "#141519",
                                  borderRadius: 10,
                                  height: 4,
                                }}
                                className="mt-5"
                              />
                              <Typography.Caption2
                                className={`flex flex-row mt-4 md:hidden text-left space-x-1.5 text-subheading font-medium ${
                                  open[protocol.name] ? "hidden" : ""
                                }`}
                              >
                                <div>More info</div>
                                <Image
                                  src={assetRootPath(`/images/arrow-down.svg`)}
                                  width="10"
                                  height="6"
                                  alt="arrow"
                                />
                              </Typography.Caption2>
                              <div
                                className={`${
                                  open[protocol.name] ? "" : "hidden md:block"
                                }`}
                              >
                                <div className="flex flex-col xl:flex-row mt-[22px] xl:mt-3 flex-wrap space-y-2 xl:space-y-0">
                                  {protocol.strategies
                                    .filter(
                                      (s) =>
                                        protocol.name !== "Vault" ||
                                        s.total !== 0
                                    )
                                    .map((strategy, i) => {
                                      return (
                                        <div
                                          className="flex flex-row justify-between xl:mr-10 xl:pt-2.5"
                                          key={i}
                                        >
                                          <div className="flex flex-row items-center">
                                            <div
                                              className={`relative ${
                                                strategy?.protocol === "Convex"
                                                  ? "w-[48px] h-[24px]"
                                                  : "w-[24px] h-[24px]"
                                              }`}
                                            >
                                              <Image
                                                src={strategy?.icon}
                                                alt={strategy.name}
                                                fill
                                              />
                                            </div>
                                            <Typography.Body3 className="pl-[12px] pr-[16px] font-light text-[12px] md:text-[16px]">
                                              {protocol.name === "Vault"
                                                ? camelifyLsd(strategy.name)
                                                : strategy.name}
                                            </Typography.Body3>
                                          </div>
                                          <Typography.Body3 className="text-subheading font-light text-[12px] md:text-[16px]">
                                            {`${formatCurrency(
                                              protocol.total
                                                ? (strategy.total / total) * 100
                                                : 0,
                                              2
                                            )}%`}
                                          </Typography.Body3>
                                        </div>
                                      );
                                    })}
                                </div>
                                <Typography.Body3 className="mt-4 text-subheading text-left text-[12px] md:text-[14px] leading-[23px]">
                                  {protocolMapping[protocol.name]?.description}
                                </Typography.Body3>
                                <Typography.Body3 className="flex flex-row mt-4 md:hidden text-left space-x-1.5 text-subheading text-[12px] font-medium">
                                  <div>Less info</div>
                                  <Image
                                    src={assetRootPath(`/images/arrow-up.svg`)}
                                    width="10"
                                    height="6"
                                    alt="arrow"
                                  />
                                </Typography.Body3>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ThemeProvider>
              </div>
            </div>
          </div>
          <div className="px-4 md:px-0">
            <GradientButton
              outerDivClassName="w-full md:w-fit md:mx-auto  hover:bg-transparent hover:opacity-90"
              className="bg-transparent py-[14px] md:py-5 md:px-20 lg:px-20 hover:bg-transparent"
              elementId="btn-allocation-docs"
              onClick={() =>
                window.open(
                  " https://docs.oeth.com/core-concepts/yield-generation",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Typography.H7 className="font-normal">
                See how yield is generated
              </Typography.H7>
            </GradientButton>
          </div>
        </div>
      </section>
      <style jsx>{`
        .allocation {
          background-color: #1e1f25;
        }

        .strategy {
          background-color: #14151980;
          border-color: #141519;
        }
      `}</style>
    </>
  );
};

export default Allocation;
function deepClone(holdings: {
  ETH?: number;
  WETH?: number;
  RETH?: number;
  FRXETH?: number;
  STETH?: number;
}) {
  throw new Error("Function not implemented.");
}
