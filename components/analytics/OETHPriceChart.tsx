import React from "react";
import { last } from "lodash";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useOETHPriceChart } from "../../hooks/analytics/useOETHPriceChart";
import { formatCurrency } from "../../utils";
import { chartOptions } from "../../utils/analytics";
import LayoutBox from "../LayoutBox";
import DefaultChartHeader from "./DefaultChartHeader";
import DurationFilter from "./DurationFilter";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OETHPriceChart = () => {
  const [{ data, filter, isFetching }, { onChangeFilter }] =
    useOETHPriceChart();
  return data ? (
    <LayoutBox
      loadingClassName="flex items-center justify-center h-[370px] w-full"
      isLoading={isFetching}
    >
      <div className="flex flex-row justify-between w-full h-[130px] p-4 md:p-6">
        <DefaultChartHeader
          title="1 OETH equals"
          display={`${formatCurrency(
            last(data?.datasets?.[0]?.data) || 0,
            6
          )} ETH`}
          date={last(data?.labels)}
        />
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
    </LayoutBox>
  ) : null;
};

export default OETHPriceChart;
