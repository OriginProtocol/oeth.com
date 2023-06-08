import React from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { last } from "lodash";
import { Typography } from "@originprotocol/origin-storybook";
import { useTotalSupplyChart } from "../../hooks/analytics/useTotalSupplyChart";
import { chartOptions } from "../../utils/analytics";
import { formatCurrency } from "../../utils";
import ErrorBoundary from "../ErrorBoundary";
import LayoutBox from "../LayoutBox";
import DurationFilter from "./DurationFilter";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const TotalSupplyChart = () => {
  const [{ data, filter, isFetching }, { onChangeFilter }] =
    useTotalSupplyChart();
  return (
    <LayoutBox
      loadingClassName="flex items-center justify-center h-[370px] w-full"
      isLoading={isFetching}
    >
      <ErrorBoundary>
        <div className="flex flex-row justify-between w-full h-[150px] p-4 md:p-6">
          <div className="flex flex-col w-full h-full">
            <Typography.Caption className="text-subheading text-base">
              Total Supply
            </Typography.Caption>
            <Typography.H4 className="mt-3">{`${formatCurrency(
              last(data?.datasets?.[0]?.data) || 0,
              2
            )}`}</Typography.H4>
            <div className="flex flex-col text-sm mb-2">
              <div className="flex flex-row items-center space-x-2">
                <div className="w-[6px] h-[6px] bg-gradient3 rounded-full" />
                <Typography.Caption className="text-subheading">
                  OETH
                </Typography.Caption>
              </div>
            </div>
            <Typography.Caption className="text-subheading">
              {last(data?.labels)}
            </Typography.Caption>
          </div>
          <div className="flex flex-col space-y-2">
            <DurationFilter
              value={filter?.duration}
              onChange={(duration) => {
                onChangeFilter({
                  duration: duration || "all",
                });
              }}
            />
          </div>
        </div>
        <div className="-ml-4 mr-4">
          <Line options={chartOptions} data={data} />
        </div>
      </ErrorBoundary>
    </LayoutBox>
  );
};

export default TotalSupplyChart;
