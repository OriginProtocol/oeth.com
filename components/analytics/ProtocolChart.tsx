import React from "react";
import { last } from "lodash";
import {
  BarElement,
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
import { Bar } from "react-chartjs-2";
import { Typography } from "@originprotocol/origin-storybook";
import { formatCurrency } from "../../utils";
import { useProtocolRevenueChart } from "../../hooks/analytics/useProtocolRevenueChart";
import LayoutBox from "../LayoutBox";
import DurationFilter from "./DurationFilter";
import MovingAverageFilter from "./MovingAverageFilter";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ProtocolChart = () => {
  const [{ data, filter, chartOptions, isFetching }, { onChangeFilter }] =
    useProtocolRevenueChart();
  return data ? (
    <LayoutBox
      loadingClassName="flex items-center justify-center h-[350px] w-full"
      isLoading={isFetching}
    >
      <div className="flex flex-row justify-between w-full h-[175px] p-4 md:p-6">
        <div className="flex flex-col w-full h-full">
          <Typography.Caption className="text-subheading text-base">
            Daily Protocol Revenue
          </Typography.Caption>
          <div className="flex flex-col space-y-2">
            <Typography.H4 className="mt-3">{`Ξ ${formatCurrency(
              Number(last(data?.datasets?.[1]?.data)) +
                Number(last(data?.datasets?.[2]?.data)),
              4
            )}`}</Typography.H4>
            <div className="flex flex-col">
              {data?.datasets?.map((dataset, index) => (
                <div key={dataset.id} className="flex flex-col">
                  <div className="flex flex-row items-center space-x-2">
                    <div
                      className="w-[6px] h-[6px] rounded-full"
                      style={{
                        backgroundColor: dataset?.backgroundColor,
                      }}
                    />
                    <Typography.Caption className="text-subheading text-xs">
                      {dataset.label}
                    </Typography.Caption>
                    <Typography.Caption className="text-xs">
                      {`Ξ ${formatCurrency(Number(last(dataset?.data)), 2)}`}
                    </Typography.Caption>
                  </div>
                </div>
              ))}
            </div>
            <Typography.Caption className="text-subheading">
              {last(data?.labels)}
            </Typography.Caption>
          </div>
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
          <div className="flex justify-end">
            <MovingAverageFilter
              value={filter?.typeOf}
              onChange={(typeOf) => {
                onChangeFilter({
                  typeOf: typeOf,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="mr-6">
        {/* @ts-ignore */}
        <Bar options={chartOptions} data={data} />
      </div>
    </LayoutBox>
  ) : null;
};

export default ProtocolChart;
