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
import { DailyStat } from "../../types";
import { commifyToDecimalPlaces, fetchProofOfYield } from "../../utils";
import moment from "moment";

interface DailyYieldProps {
  dailyStats: DailyStat[];
}

const viewMoreAmount = 30;

const DailyYield = ({ dailyStats }: DailyYieldProps) => {
  const width = useViewWidth();
  const router = useRouter();
  const [stats, setStats] = useState(dailyStats);

  const routeToYieldOnDay = (date: string) => {
    router.push(`/proof-of-yield/${date}`, undefined, { scroll: true });
  };

  const moreDays = async (offset: number) => {
    const moreStats = await fetchProofOfYield(offset);
    setStats((prevStats) => prevStats.concat(moreStats));
  };

  const validDate = (date: string) => {
    return moment(date).isAfter("2023-04-26");
  };

  return (
    <Section className="mt-10 md:mt-28">
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
              Yield {width >= smSize ? "distributed" : "dist"}
            </TableHead>
            <TableHead
              info={`The annualized, compounded rate earned by OETH holders on this day`}
              className="pr-4 sm:pr-8 lg:pr-14 xl:pr-24"
            >
              Daily APY
            </TableHead>
            {width >= smSize && (
              <TableHead
                info={`Yield is distributed to all regular Ethereum wallets and any smart contracts or multi-sigs that have opted-in.`}
                className="pr-0 xl:pr-8"
              >
                Yield-earning supply
              </TableHead>
            )}
            <TableHead />
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="relative px-6">
          {stats
            .filter((s) => validDate(s.date))
            .map((item, i) => {
              // Skip estimation for current day
              if (i === 0) return;
              return (
                <tr
                  className="group border-t md:border-t-2 hover:bg-hover-bg border-origin-bg-black cursor-pointer"
                  key={item.date}
                  onClick={() => routeToYieldOnDay(item.date.substring(0, 10))}
                >
                  <TableData align="left" className="pl-4 md:pl-8">
                    {moment.utc(item.date).format("MMM D, YYYY")}
                  </TableData>
                  <TableData className="pr-8 lg:pr-14 xl:pr-24">
                    <div className="flex items-center">
                      {commifyToDecimalPlaces(parseFloat(item.yield), 2)}
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
                          2,
                        )}
                      </div>
                    </TableData>
                  )}
                  <TableData className="px-6" align="center">
                    <ChartDetailsButton
                      onClick={() =>
                        routeToYieldOnDay(item.date.substring(0, 10))
                      }
                    >
                      Proof of yield
                    </ChartDetailsButton>
                  </TableData>
                </tr>
              );
            })}
        </tbody>
      </Table>

      {/* If last element of the stats array is a valid date, then keep the View more button */}
      {validDate(stats[stats.length - 1].date) && (
        <GradientButton
          outerDivClassName="mx-auto mt-6 mb-10 md:mb-0"
          className="bg-transparent hover:bg-transparent text-base px-8 py-[6px] md:px-10 md:py-3"
          onClick={() => moreDays(stats.length)}
        >
          View more
        </GradientButton>
      )}
    </Section>
  );
};

export default DailyYield;
