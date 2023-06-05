import React, { useState } from "react";
import {
  Section,
  TableData,
  TableHead,
  Table,
  ChartDetailsButton,
  GradientButton,
} from "../../components";
import { smSize } from "../../constants";
import { useViewWidth } from "../../hooks";
import { useRouter } from "next/router";
import { utils } from "ethers";
import { DailyStat } from "../../types";
import { commifyToDecimalPlaces, fetchDailyStats } from "../../utils";
import moment from "moment";
const { commify } = utils;

interface DailyYieldProps {
  dailyStats: DailyStat[];
}

const viewMoreAmount = 30;

const DailyYield = ({ dailyStats }: DailyYieldProps) => {
  const width = useViewWidth();
  const router = useRouter();
  const [stats, setStats] = useState(dailyStats);

  const routeToYieldOnDay = (date: number) => {
    router.push(`/proof-of-yield/${date}`);
  };

  const moreDays = async (begin: number, end: number) => {
    const moreStats = await fetchDailyStats(end, begin);
    setStats(() => [...moreStats]);
  };

  return (
    <Section className="mt-10 md:mt-28">
      {/* Buttons */}
      {/* <div className="mb-3 sm:mb-6 bg-tooltip w-fit p-2 rounded-[100px]">
        <button
          className={twMerge(
            `rounded-[100px] border border-tooltip px-12 py-3`,
            ` ${days ? highlightCss : ""}`
          )}
          onClick={() => seTableDataays(true)}
        >
          Days
        </button>
        <button
          className={twMerge(
            `rounded-[100px] border border-tooltip px-12 py-3`,
            ` ${!days ? highlightCss : ""}`
          )}
          onClick={() => seTableDataays(false)}
        >
          Blocks
        </button>
      </div> */}

      {/* Main Table */}
      <Table>
        {/* Table Head */}

        <thead>
          <tr>
            <TableHead align="left" className="pl-8">
              Date
            </TableHead>
            <TableHead
              info={`The actual amount of OETH added to users' wallet balances`}
              className="whitespace-normal sm:whitespace-nowrap pr-8 lg:pr-14 xl:pr-24"
            >
              Yield distributed
            </TableHead>
            <TableHead
              info={`The annualized, compounded rate earned by OETH holders on this day`}
              className="pr-8 sm:pr-8 lg:pr-14 xl:pr-24"
            >
              APY
            </TableHead>
            {width >= smSize && (
              <TableHead
                info={`The sum of all assets currently held by OETH`}
                className="px-8"
              >
                Vault value
              </TableHead>
            )}
            {/* {width >= smSize && (
              <TableHead info={true} className="pr-0 xl:pr-8">
                Vault value
              </TableHead>
            )} */}
            {/* <TableHead></TableHead> */}
          </tr>
        </thead>

        {/* Table Body */}

        <tbody className="relative px-6">
          {stats.map((item, i) => (
            <tr
              className="group border-t md:border-t-2 hover:bg-hover-bg border-origin-bg-black /cursor-pointer"
              key={item.date}
              // onClick={() => routeToYieldOnDay(item.date)}
            >
              <TableData align="left" className="pl-8">
                {i === 0
                  ? "Today so far"
                  : moment.utc(item.date).format("MMM D, YYYY")}
              </TableData>
              <TableData className="pr-8 lg:pr-14 xl:pr-24">
                Ξ {commifyToDecimalPlaces(parseFloat(item.yield), 2)}
              </TableData>
              <TableData className="pr-8 sm:pr-8 lg:pr-14 xl:pr-24">
                {parseFloat(item.apy) === 0
                  ? "-"
                  : `${commifyToDecimalPlaces(parseFloat(item.apy), 2)}%`}
              </TableData>
              {width >= smSize && (
                <TableData className="px-8">
                  Ξ {commifyToDecimalPlaces(parseFloat(item.backing_supply), 2)}
                </TableData>
              )}
              {/* {width >= smSize && (
                <TableData className="pr-0 xl:pr-8">
                  Ξ {commifyToDecimalPlaces(parseFloat(item.backing_supply), 2)}
                </TableData>
              )} */}
              {/* <TableData className="px-6" align="center">
                <ChartDetailsButton
                  onClick={() => routeToYieldOnDay(item.date)}
                >
                  Proof of yield
                </ChartDetailsButton>
              </TableData> */}
            </tr>
          ))}
        </tbody>
      </Table>

      <GradientButton
        outerDivClassName="mx-auto mt-6"
        className="bg-transparent hover:bg-transparent text-base lg:px-10 py-3"
        onClick={() => moreDays(stats.length, stats.length + viewMoreAmount)}
      >
        View More
      </GradientButton>
    </Section>
  );
};

export default DailyYield;
