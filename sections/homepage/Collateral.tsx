import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@originprotocol/origin-storybook";
import { assetRootPath, camelifyLsd } from "../../utils";
import { PieChart } from "react-minimal-pie-chart";
import { formatCurrency, rounded } from "../../utils";
import { tokenColors, strategyMapping } from "../../constants";
import { Collateral as CollateralType, Strategies } from "../../types";
import { GradientButton } from "../../components";

const mockBacking = [
  { name: "eth", total: 11981522.633824237 },
  { name: "steth", total: 13409101.919790775 },
  { name: "reth", total: 13264216.480711127 },
  { name: "sfrxeth", total: 13264216.480711127 },
];

interface CollateralProps {
  collateral: CollateralType[];
  strategies: Strategies;
}

const Collateral = ({ collateral, strategies }: CollateralProps) => {
  const [open, setOpen] = useState(false);
  const backingTokens = ["weth", "steth", "reth", "frxeth", "oeth"];

  //@ts-ignore
  const total: number = collateral?.reduce((t, s) => {
    return {
      total: Number(t.total) + Number(s.total),
    };
  }).total;

  const strategiesSorted =
    strategies &&
    Object.keys(strategies)
      .sort((a, b) => strategies[a].total - strategies[b].total)
      .reverse();

  const backing = collateral.filter((token) =>
    backingTokens.includes(token.name)
  );

  const chartData = backing
    ?.filter((e) => e.name !== "oeth")
    .map((token) => {
      return {
        title: token?.name.toUpperCase(),
        value: total ? (Number(token?.total) / total) * 100 : 0,
        color: tokenColors[token?.name] || "#ff0000",
      };
    });

  const tokenSymbols = {
    weth: "WETH",
    steth: "stETH",
    reth: "rETH",
    frxeth: "frxETH",
  };

  const tokenNames = {
    weth: "Wrapped Ether",
    steth: "Lido Staked ETH",
    reth: "Rocket Pool ETH",
    frxeth: "Frax ETH",
  };

  return (
    <>
      <section className="bg-origin-bg-grey">
        <div className="px-[16px] md:px-[64px] lg:px-[134px] py-14 md:py-[120px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 500 }}
          >
            Instantly redeemable
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto !leading-[23px] md:!leading-[28px] text-subheading text-sm md:text-base">
            OETH&apos;s on-chain reserves remain liquid and available for
            permissionless redemption with no gatekeepers or withdrawal queue.
          </Typography.Body3>
          <div className="max-w-[1432px] mx-auto mt-10 md:mt-20 mb-10 md:mb-20 py-6 xl:py-20 rounded-xl bg-origin-bg-black">
            <div className="flex flex-col md:flex-row justify-between px-6 xl:px-[132px]">
              <div className="relative w-full sm:w-1/2 mx-auto my-auto rounded-full p-4 bg-origin-bg-grey">
                <PieChart
                  data={chartData}
                  lineWidth={6}
                  startAngle={270}
                  paddingAngle={2}
                />
                <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-[16px] md:translate-y-[20px]">
                  <Typography.H6 className="text-[16px] md:text-[24px] leading-[32px]">
                    Total
                  </Typography.H6>
                  <Typography.H6 className="md:mt-3 text-[24px] md:text-[40px] leading-[32px] md:leading-[40px]">{`Ξ ${formatCurrency(
                    total,
                    2
                  )}`}</Typography.H6>
                </div>
              </div>
              <div className="md:w-1/2 md:ml-10 xl:ml-32 mt-6 md:my-auto pl-0 md:py-10 text-left">
                <div className="flex flex-col justify-between space-y-2">
                  {backing?.map((token, i) => {
                    if (token.name === "oeth") return;
                    return (
                      <div
                        className="flex flex-row md:my-0 px-4 py-[13.5px] md:p-6 rounded-[8px] bg-origin-bg-grey w-full md:max-w-[351px] space-x-3 md:space-x-[22px]"
                        key={i}
                      >
                        <div className="relative w-12 md:w-[48px]">
                          <Image
                            src={assetRootPath(
                              `/images/${token.name}-outline.svg`
                            )}
                            fill
                            sizes="(max-width: 768px) 48px, 24px"
                            alt={token.name}
                          />
                        </div>
                        <div>
                          <div className="">
                            <Typography.H7
                              className="text-[14px] md:text-[20px] inline mr-1"
                              style={{ fontWeight: 700 }}
                            >
                              {`${tokenNames[token.name]}`}
                            </Typography.H7>
                            <Typography.H7
                              className="text-[14px] md:text-[20px] inline text-table-title"
                              style={{ fontWeight: 400 }}
                            >
                              {`(${tokenSymbols[token.name]})`}
                            </Typography.H7>
                          </div>
                          <div className="flex flex-row space-x-2">
                            <Typography.Body
                              className="text-[12px] md:text-[16px]"
                              style={{ fontWeight: 700 }}
                            >
                              {`${formatCurrency(
                                (Number(token.total) / total) * 100,
                                2
                              )}%`}
                            </Typography.Body>
                            <Typography.Body
                              className="text-[12px] md:text-[16px] text-subheading"
                              style={{ fontWeight: 400 }}
                            >
                              {`Ξ${formatCurrency(token.total, 2)}`}
                            </Typography.Body>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-6 md:mt-20 px-6 md:px-20 text-left ${
                open ? "" : "hidden"
              }`}
            >
              {strategies &&
                strategiesSorted?.map((strategy, i) => {
                  const tokens = strategyMapping[strategy]?.tokens;
                  return (
                    <div
                      className="p-4 md:p-6 rounded-[7px] bg-origin-bg-grey"
                      key={i}
                    >
                      <Link
                        href={`https://etherscan.io/address/${strategyMapping[strategy]?.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row space-x-1"
                      >
                        <Typography.Body
                          className="text-[16px] leading-[28px]"
                          style={{ fontWeight: 500 }}
                        >
                          {strategyMapping[strategy]?.short_name}
                        </Typography.Body>
                        <Image
                          src={assetRootPath("/images/link.svg")}
                          width="12"
                          height="12"
                          className="mt-1"
                          alt="External link"
                        />
                      </Link>
                      <Typography.Body3 className="mt-2 md:mt-4 text-[12px] leading-[20px] text-subheading">
                        Collateral
                      </Typography.Body3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-1 md:gap-y-3 mt-2">
                        {tokens?.map((token, i) => {
                          return (
                            <div className="flex flex-row space-x-2" key={i}>
                              <Image
                                src={assetRootPath(
                                  `/images/${
                                    token === "frxeth" ? "frax" : token
                                  }-icon.svg`
                                )}
                                width="28"
                                height="28"
                                alt={token}
                              />
                              <div className="flex flex-col">
                                <Typography.Body3 className="text-[14px] leading-[27px]">
                                  {camelifyLsd(token.toUpperCase())}
                                </Typography.Body3>
                                <Link
                                  href={
                                    //@ts-ignore
                                    strategyMapping[strategy]?.token
                                      ? //@ts-ignore
                                        `https://etherscan.io/token/${strategyMapping[strategy]?.token}?a=${strategyMapping[strategy]?.address}`
                                      : `https://etherscan.io/address/${strategyMapping[strategy]?.address}#tokentxns`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-row space-x-1"
                                >
                                  <Typography.Body3 className="text-[12px] leading-[19px] text-subheading">
                                    {`Ξ${rounded(
                                      strategies[strategy].holdings[
                                        (token === "weth"
                                          ? "ETH"
                                          : token
                                        ).toUpperCase()
                                      ],
                                      2
                                    )}`}
                                  </Typography.Body3>
                                  <Image
                                    src={assetRootPath("/images/link.svg")}
                                    width="12"
                                    height="12"
                                    className="shrink-0"
                                    alt="External link"
                                  />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div
              className="w-min mt-6 md:mt-20 mx-auto p-0.5 rounded-full whitespace-nowrap gradient3 cursor-pointer hover:opacity-90"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              <div
                className="rounded-full flex flex-row justify-between items-center space-x-2 bg-origin-bg-black px-6 py-1"
                id="btn-collateral-read"
              >
                <Typography.Body3
                  className="text-[16px] leading-[28px]"
                  style={{ fontWeight: 500 }}
                >
                  {open ? "Hide contracts" : "View contracts"}
                </Typography.Body3>
                <div className="w-3.5">
                  <Image
                    src={assetRootPath(`/images/caret-white.svg`)}
                    width="14"
                    height="8"
                    className={`${open ? "rotate-180" : ""}`}
                    id="btn-collateral-read-img"
                    alt="arrow"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 md:px-0">
            <GradientButton
              outerDivClassName="w-full md:w-fit md:mx-auto  hover:bg-transparent hover:opacity-90"
              className="bg-transparent py-[14px] md:py-5 md:px-20 lg:px-20 hover:bg-transparent"
              elementId="btn-collateral-docs"
              onClick={() =>
                window.open("https://docs.ousd.com/how-it-works", "_blank")
              }
            >
              <Typography.H7 className="font-normal">
                See how it works
              </Typography.H7>
            </GradientButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default Collateral;
