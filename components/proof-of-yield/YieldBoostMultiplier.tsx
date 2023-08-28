import React from "react";
import { TitleWithInfo } from ".";
import { YieldBoostMultiplierProps } from "../../types";
import { Typography } from "@originprotocol/origin-storybook";
import { commifyToDecimalPlaces } from "../../utils";

const YieldBoostMultiplier = ({
  rawApy,
  boost,
  totalApy,
  rebasingSupply,
  nonRebasingSupply,
}: YieldBoostMultiplierProps) => {
  return (
    <div className="w-full lg:w-1/3 h-min rounded-lg bg-origin-bg-grey text-blurry">
      <div className="flex justify-center items-center w-fit mx-4 md:mx-8 mt-8 pt-6 md:pt-8 lg:pt-0">
        <TitleWithInfo
          info="APY is amplified since only some OETH earns yield while 100% of the collateral is used to generate yield"
          textClassName="text-white text-base md:text-xl mr-1"
          whiteTooltip={true}
        >
          Yield bonus
        </TitleWithInfo>
      </div>
      <div className="border md:border-2 mx-4 md:mx-8 border-origin-bg-black px-4 md:px-6 py-4 mt-6 rounded-t-lg flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center">
        <div>
          <Typography.Body className="inline mr-1">
            {commifyToDecimalPlaces(rawApy, 2)}%
          </Typography.Body>
          <Typography.Body2 className="inline">APY</Typography.Body2>
        </div>
        <div>
          <Typography.Body3 className="text-table-title text-sm">
            Raw yield generated
          </Typography.Body3>
        </div>
      </div>
      <div className="border-x md:border-x-2 mx-4 md:mx-8 border-t-0 border-origin-bg-black px-4 md:px-6 py-4 flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center">
        <div>
          <Typography.Body className="inline mr-3">x</Typography.Body>
          <Typography.Body className="inline mr-1">
            {commifyToDecimalPlaces(boost, 2)}
          </Typography.Body>
          <Typography.Body2 className="inline">Multiplier</Typography.Body2>
        </div>
        <div>
          <Typography.Body3 className="text-table-title text-sm text-left 2xl:text-right">
            Circulating supply / yield-earning supply
          </Typography.Body3>
        </div>
      </div>
      <div className="border md:border-2 mx-4 md:mx-8 border-origin-bg-black px-4 md:px-6 py-4 flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center rounded-b-lg">
        <div>
          <Typography.Body className="inline mr-3">=</Typography.Body>
          <Typography.Body className="inline mr-1">
            {" "}
            {commifyToDecimalPlaces(totalApy, 2)}%
          </Typography.Body>
          <Typography.Body2 className="inline">APY</Typography.Body2>
        </div>
        <div>
          <Typography.Body3 className="text-table-title text-sm text-left 2xl:text-right">
            Actual yield distributed
          </Typography.Body3>
        </div>
      </div>
      <div className="mt-8 flex flex-col xl:flex-row border-t md:border-t-2 border-origin-bg-black">
        <div className="w-full xl:w-1/2 py-6 px-6 border-b md:border-b-2 xl:border-b-0 xl:border-r-2 border-origin-bg-black">
          <TitleWithInfo
            info="Yield is distributed to all regular Ethereum wallets and any smart contracts or multi-sigs that have opted-in"
            className="mb-1"
            textClassName="text-xs md:text-xs"
          >
            OETH receiving yield{" "}
          </TitleWithInfo>
          <Typography.Body className="text-left w-full inline">
            {" "}
            {commifyToDecimalPlaces(rebasingSupply, 0)}
          </Typography.Body>
        </div>

        <div className="flex xl:justify-center items-center my-6">
          <div className="px-6 whitespace-nowrap">
            <TitleWithInfo
              info="By default, yield is not distributed to smart contracts, such as AMMs. This extra yield becomes a bonus for other OETH holders"
              className="mb-1"
              textClassName="text-xs md:text-xs"
            >
              OETH giving up yield{" "}
            </TitleWithInfo>
            <Typography.Body className="text-left w-full inline">
              {" "}
              {commifyToDecimalPlaces(nonRebasingSupply, 0)}
            </Typography.Body>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldBoostMultiplier;
