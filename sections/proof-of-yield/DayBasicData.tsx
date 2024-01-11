import React from "react";
import Image from "next/image";
import moment, { Moment } from "moment";
import { useRouter } from "next/router";
import { assetRootPath, commifyToDecimalPlaces } from "../../utils";
import {
  BasicData,
  Table,
  TableData,
  TableHead,
  TitleWithInfo,
  YieldBoostMultiplier,
  Section,
  Tooltip,
} from "../../components";
import { Typography } from "@originprotocol/origin-storybook";
import { smSize, lgSize, xlSize } from "../../constants";
import { shortenAddress } from "../../utils";
import { useViewWidth } from "../../hooks";
import { twMerge } from "tailwind-merge";
import { DailyStat, YieldBoostMultiplierProps } from "../../types";
import DripperInfo from "./DripperInfo";
import YieldSources from "./YieldSources";
import { DailyYield } from "../../queries/fetchDailyYields";

const eventChartColumnCssRight = "pr-6 xl:pr-8";
const eventChartColumnCssLeft = "pl-6 xl:pr-8";

interface DayBasicDataProps {
  timestamp: Moment;
  dailyStat: DailyStat;
  strategiesLatest: DailyYield[];
  strategyHistory: Record<string, DailyYield[]>;
  sectionOverrideCss?: string;
}

const DayBasicData = ({
  timestamp,
  dailyStat,
  strategiesLatest,
  strategyHistory,
  sectionOverrideCss,
}: DayBasicDataProps) => {
  const router = useRouter();
  const width = useViewWidth();

  const yieldBonusProps: YieldBoostMultiplierProps = {
    rawApy: parseFloat(dailyStat?.raw_apy) || 0.0,
    boost: parseFloat(dailyStat?.apy_boost) || 0.0,
    totalApy: parseFloat(dailyStat?.apy) || 0.0,
    rebasingSupply: parseFloat(dailyStat?.rebasing_supply) || 0.0,
    nonRebasingSupply: parseFloat(dailyStat?.non_rebasing_supply) || 0.0,
  };

  return (
    <Section className={twMerge("mb-10 md:mb-20", sectionOverrideCss)}>
      <button
        onClick={() => {
          router.push("/proof-of-yield");
        }}
        className={`relative bg-origin-bg-black rounded-[100px] py-2 text-origin-white flex items-center`}
      >
        <Image
          src={assetRootPath("/images/arrow-left.svg")}
          width="20"
          height="20"
          alt="arrow-left"
          className="pr-3 inline"
        />
        Back to list
      </button>

      {/* Date PT */}
      <div className="flex mt-6 md:mt-20">
        <Typography.Body className="">
          {timestamp.format("MMM D, YYYY")} PT
        </Typography.Body>
        <Tooltip
          info={
            "Yield is distributed at least once per day using Chainlink Automation. It is scheduled to run at approximately midnight Pacific Time, which serves as the beginning of each calendar day."
          }
          whiteTooltip
          className="ml-2 md:min-w-[12px] md:min-h-[12px] md:max-w-[12px] md:max-h-[12px]"
          tooltipClassName="min-w-[180px]"
        />
      </div>

      <TitleWithInfo
        info="The actual amount of OETH added to users' wallet balances"
        className="mt-4 md:mt-10 mb-2 md:mb-4"
      >
        Yield distributed
      </TitleWithInfo>

      <div className="w-fit flex justify-center items-end">
        <Typography.H2 className="font-bold inline">
          {commifyToDecimalPlaces(parseFloat(dailyStat.yield), 4)}
        </Typography.H2>
        <Typography.H7 className="inline ml-2 mb-1">OETH</Typography.H7>
      </div>

      <div className="w-full mt-8 md:mt-14 flex">
        <div className="w-full lg:w-2/3 lg:mr-8">
          {/* Basic Stats section */}
          <div className="flex">
            <BasicData
              className="flex-1 rounded-tl-lg xl:rounded-l-lg justify-center lg:justify-start"
              title="APY"
              info={`The annualized, compounded rate earned by OETH holders on this day`}
            >
              {parseFloat(dailyStat.apy) === 0
                ? "-"
                : `${commifyToDecimalPlaces(parseFloat(dailyStat.apy), 2)}%`}
            </BasicData>
            <BasicData
              className="flex-1 rounded-tr-lg xl:rounded-none justify-center lg:justify-start"
              title="OETH vault value"
              info={`The sum of all assets currently held by OETH`}
            >
              {" "}
              {commifyToDecimalPlaces(parseFloat(dailyStat.backing_supply), 2)}
            </BasicData>
            {width >= xlSize && (
              <BasicData
                className="flex-1 rounded-b-lg xl:rounded-bl-none xl:rounded-r-lg mt-0.5 xl:mt-0"
                title="Fees generated"
                info="The portion of the yield collected by the Origin DeFi DAO"
              >
                <div className="flex items-center">
                  {commifyToDecimalPlaces(parseFloat(dailyStat.fees), 4)}
                </div>
              </BasicData>
            )}
          </div>

          {width < xlSize && (
            <BasicData
              className="flex-1 flex justify-center rounded-b-lg xl:rounded-bl-none xl:rounded-r-lg mt-0.5 xl:mt-0"
              title="Fees generated"
              info="The portion of the yield collected by the Origin DeFi DAO"
            >
              <div className="flex items-center">
                {commifyToDecimalPlaces(parseFloat(dailyStat.yield), 4)}
              </div>
            </BasicData>
          )}

          {width < lgSize && <YieldBoostMultiplier {...yieldBonusProps} />}

          {/* Yield distribution events */}
          <div className="text-blurry mt-14">
            <Typography.Body className="text-xl">
              Yield distribution events
            </Typography.Body>
            <Typography.Body3 className="mt-3 text-xs text-table-title">
              OETH wallet balances increase at least once per day. Anyone can
              trigger yield distribution at any time. Each time yield is
              distributed, there is one corresponding transaction on the
              blockchain.
            </Typography.Body3>
            <Table className="mt-6">
              <thead>
                <tr>
                  <TableHead align="left" className={eventChartColumnCssLeft}>
                    Block / Time
                  </TableHead>
                  {width >= smSize ? (
                    <TableHead className={eventChartColumnCssRight}>
                      Amount
                    </TableHead>
                  ) : (
                    <TableHead
                      className={twMerge(
                        eventChartColumnCssLeft,
                        "whitespace-normal pr-4",
                      )}
                    >
                      Amount
                    </TableHead>
                  )}
                  <TableHead
                    info="The portion of the yield collected by the Origin DeFi DAO"
                    className={eventChartColumnCssRight}
                  >
                    Fees
                  </TableHead>
                  <TableHead className={eventChartColumnCssRight}>
                    {width >= lgSize ? "Transaction" : "Txn"}
                  </TableHead>
                </tr>
              </thead>
              <tbody>
                {dailyStat?.rebase_events?.map((item) => (
                  <tr
                    className="group border-t md:border-t-2 hover:bg-hover-bg border-origin-bg-black"
                    key={`${item.block_number}-${item.tx_hash}`}
                  >
                    <TableData align="left" className={eventChartColumnCssLeft}>
                      <Typography.Body2 className="text-xs md:text-base mb-1">
                        {item.block_number}
                      </Typography.Body2>
                      <Typography.Body3 className="text-xs md:text-sm text-table-title">
                        {moment(item.block_time)
                          .utcOffset("-07:00")
                          .format("HH:mm:ss")}
                      </Typography.Body3>
                    </TableData>
                    {width >= smSize ? (
                      <TableData className={eventChartColumnCssRight}>
                        {commifyToDecimalPlaces(parseFloat(item.amount), 4)}
                      </TableData>
                    ) : (
                      <TableData
                        className={twMerge(
                          eventChartColumnCssLeft,
                          "whitespace-normal pr-4",
                        )}
                      >
                        <Typography.Body3 className="text-xs md:text-base text-table-data">
                          {commifyToDecimalPlaces(parseFloat(item.amount), 4)}
                        </Typography.Body3>
                      </TableData>
                    )}

                    <TableData className={eventChartColumnCssRight}>
                      {commifyToDecimalPlaces(parseFloat(item.fee), 4)}
                    </TableData>
                    <TableData className={eventChartColumnCssRight}>
                      <a
                        href={`https://etherscan.io/tx/${item.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-end items-center ml-2"
                      >
                        {width >= lgSize && shortenAddress(item.tx_hash, 3)}
                        <Image
                          src={assetRootPath("/images/ext-link-white.svg")}
                          width="14"
                          height="14"
                          alt="ext-link"
                          className="inline md:ml-2 w-[8px] h-[8px] md:w-[14px] md:h-[14px]"
                        />
                      </a>
                    </TableData>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="mt-8">
            <DripperInfo />
          </div>

          <div className="mt-8">
            <YieldSources
              timestamp={timestamp.toDate()}
              strategiesLatest={strategiesLatest}
              strategyHistory={strategyHistory}
            />
          </div>
        </div>
        {/* Yield boost multiplier */}

        {width >= lgSize && <YieldBoostMultiplier {...yieldBonusProps} />}
      </div>
    </Section>
  );
};

export default DayBasicData;
