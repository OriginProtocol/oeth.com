import React, { useState } from "react";
import Image from "next/image";
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
import {
  assetRootPath,
  commifyToDecimalPlaces,
  fetchDailyStats,
} from "../../utils";
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

  const validDate = (date: string) => {
    return moment(date).isAfter("2023-04-26");
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
            <TableHead align="left" className="pl-4 md:pl-8">
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
              className="pr-4 sm:pr-8 lg:pr-14 xl:pr-24"
            >
              APY
            </TableHead>
            {width >= smSize && (
              <TableHead
                info={`Yield is distributed to all regular Ethereum wallets and any smart contracts or mult-sigs that have opted-in.`}
                className="pr-0 xl:pr-8"
              >
                Yield-earning supply
              </TableHead>
            )}
            <TableHead></TableHead>
          </tr>
        </thead>

        {/* Table Body */}

        <tbody className="relative px-6">
          {console.log(stats.filter((s) => validDate(s.date)))}
          {stats
            .filter((s) => validDate(s.date))
            .map((item, i) =>
              // Skip estimation for current day
              i === 0 ? (
                <></>
              ) : (
                <tr
                  className="group border-t md:border-t-2 hover:bg-hover-bg border-origin-bg-black cursor-pointer"
                  key={item.date}
                  onClick={() =>
                    routeToYieldOnDay(moment(item.date).unix() * 1000)
                  }
                >
                  <TableData align="left" className="pl-4 md:pl-8">
                    {moment.utc(item.date).format("MMM D, YYYY")}
                  </TableData>
                  <TableData className="pr-8 lg:pr-14 xl:pr-24">
                    <div className="flex items-center">
                      {commifyToDecimalPlaces(parseFloat(item.yield), 2)}
                      <Image
                        src={assetRootPath("/images/oeth.svg")}
                        width="64"
                        height="64"
                        alt="oeth"
                        className="inline ml-1 md:ml-2 w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                      />
                    </div>
                  </TableData>
                  <TableData className="pr-4 sm:pr-8 lg:pr-14 xl:pr-24">
                    {parseFloat(item.apy) === 0
                      ? "-"
                      : `${commifyToDecimalPlaces(parseFloat(item.apy), 2)}%`}
                  </TableData>
                  {width >= smSize && (
                    <TableData className="pr-0 xl:pr-8">
                      {" "}
                      <div className="flex items-center">
                        {commifyToDecimalPlaces(
                          parseFloat(item.rebasing_supply),
                          2
                        )}
                        <Image
                          src={assetRootPath("/images/oeth.svg")}
                          width="64"
                          height="64"
                          alt="oeth"
                          className="inline ml-1 md:ml-2 w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                        />
                      </div>
                    </TableData>
                  )}
                  <TableData className="px-6" align="center">
                    <ChartDetailsButton
                      onClick={() =>
                        routeToYieldOnDay(moment(item.date).milliseconds())
                      }
                    >
                      Proof of yield
                    </ChartDetailsButton>
                  </TableData>
                </tr>
              )
            )}
        </tbody>
      </Table>

      {/* If last element of the stats array is a valid date, then keep the View more button */}
      {validDate(stats[stats.length - 1].date) && (
        <GradientButton
          outerDivClassName="mx-auto mt-6 mb-10 md:mb-0"
          className="bg-transparent hover:bg-transparent text-base px-8 py-[6px] md:px-10 md:py-3"
          onClick={() => moreDays(stats.length, stats.length + viewMoreAmount)}
        >
          View more
        </GradientButton>
      )}
    </Section>
  );
};

export default DailyYield;
