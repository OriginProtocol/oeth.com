import React, { useMemo } from "react";
import Head from "next/head";
import classnames from "classnames";
import { Typography } from "@originprotocol/origin-storybook";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import { ProtocolChart } from "../../components/analytics";
import { useProtocolRevenueChart } from "../../hooks/analytics/useProtocolRevenueChart";
import { formatCurrency } from "../../utils/math";
import { ErrorBoundary, LayoutBox, TwoColumnLayout } from "../../components";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const ProtocolRevenueDetails = ({ breakdowns, isFetching }) => {
  return (
    <div className="flex flex-col md:flex-row gap-1 items-center w-full">
      {breakdowns.map(({ label, infoHelp, percentageDiff, display }, index) => (
        <LayoutBox
          key={label}
          isLoading={isFetching}
          className={classnames({
            "rounded-tr-none rounded-br-none w-full h-full": index === 0,
            "rounded-none": index > 0 && index !== breakdowns.length - 1, // middle sections
            "rounded-tl-none rounded-bl-none": index === breakdowns.length - 1,
          })}
        >
          <div className="flex flex-row w-full h-[110px] md:h-[150px] items-center space-x-6 px-6">
            <div className="flex flex-col space-y-1">
              <Typography.Body2 className="relative text-subheading">
                {label}
                {percentageDiff && (
                  <span className="text-white">
                    {<span>{percentageDiff}</span>}
                  </span>
                )}
              </Typography.Body2>
              <Typography.H7>
                {display} <span className="text-base font-medium">OETH</span>
              </Typography.H7>
            </div>
          </div>
        </LayoutBox>
      ))}
    </div>
  );
};

const AnalyticsProtocolRevenue = () => {
  const [{ data, aggregations, isFetching }] = useProtocolRevenueChart();

  const breakdowns = useMemo(() => {
    const {
      dailyRevenue = 0,
      weeklyRevenue = 0,
      allTimeRevenue = 0,
    } = aggregations || {};
    return [
      {
        label: "24H revenue",
        display: `${formatCurrency(dailyRevenue, 4)}`,
        value: dailyRevenue,
      },
      {
        label: "7D revenue",
        display: `${formatCurrency(weeklyRevenue, 4)}`,
        value: weeklyRevenue,
      },
      {
        label: "All time revenue",
        display: `${formatCurrency(allTimeRevenue, 4)}`,
        value: allTimeRevenue,
      },
    ];
  }, [JSON.stringify(data)]);

  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Protocol Revenue</title>
      </Head>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <ProtocolRevenueDetails
            breakdowns={breakdowns}
            isFetching={isFetching}
          />
        </div>
        <div className="col-span-12">
          <ProtocolChart />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsProtocolRevenue;

AnalyticsProtocolRevenue.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
