import React, { useMemo, useState } from "react";
import Head from "next/head";
import { PieChart } from "react-minimal-pie-chart";
import { Line } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  TimeScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { last, orderBy } from "lodash";
import { Typography } from "@originprotocol/origin-storybook";
import { GetServerSideProps } from "next";
import {
  ErrorBoundary,
  LayoutBox,
  TwoColumnLayout,
  ReactTooltip,
} from "../../components";
import { formatCurrency, formatPercentage } from "../../utils/math";
import { aggregateCollateral, chartOptions } from "../../utils/analytics";
import {
  DefaultChartHeader,
  DurationFilter,
  MovingAverageFilter,
} from "../../components/analytics";
import { useAPYChart } from "../../hooks/analytics/useAPYChart";
import { useTotalSupplyChart } from "../../hooks/analytics/useTotalSupplyChart";
import { fetchAllocation, fetchCollateral } from "../../utils/api";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  RadialLinearScale,
  Filler,
  Legend
);

const APYChartContainer = () => {
  const [{ data, filter, isFetching }, { onChangeFilter }] = useAPYChart();
  return data ? (
    <LayoutBox
      loadingClassName="flex items-center justify-center h-[370px] w-full"
      isLoading={isFetching}
    >
      <div className="flex flex-row justify-between w-full h-[130px] p-4 md:p-6">
        <DefaultChartHeader
          title="APY"
          display={`${formatCurrency(
            last(data?.datasets?.[0]?.data) || 0,
            2
          )}%`}
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
        <Line options={chartOptions} data={data} />
      </div>
    </LayoutBox>
  ) : null;
};

const TotalSupplyChartContainer = () => {
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
        <div className="mr-6">
          <Line options={chartOptions} data={data} />
        </div>
      </ErrorBoundary>
    </LayoutBox>
  );
};

const makeTooltipContent = ({ tooltip, value }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-origin-bg-black">
      <Typography.Caption>{tooltip}</Typography.Caption>
      <Typography.Caption>{formatCurrency(value, 2)}</Typography.Caption>
    </div>
  );
};

const CurrentCollateralContainer = ({ data, tvl, tvlUsd }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: "Current Collateral",
          data: data.map((item) => item.total),
          backgroundColor: data.map((item) => item.color),
          borderWidth: 0,
          hoverOffset: 50,
        },
      ],
    };
  }, []);

  const totalSum = useMemo(() => {
    return data.reduce((acc, item) => {
      acc += Number(item.total || 0);
      return acc;
    }, 0);
  }, [JSON.stringify(data)]);

  const piechartData = useMemo(() => {
    return chartData?.datasets?.[0]?.data.map((value, index) => {
      const token = chartData?.labels?.[index];
      const color = chartData?.datasets?.[0]?.backgroundColor[index];
      return {
        title: token,
        value,
        color,
        tooltip: token,
      };
    });
  }, [JSON.stringify(chartData)]);

  return data ? (
    <LayoutBox
      className="min-h-[370px]"
      loadingClassName="flex items-center justify-center w-full h-[370px]"
    >
      <ErrorBoundary>
        <div className="flex flex-row justify-between w-full h-[80px] p-4 md:p-6">
          <div className="flex flex-col w-full h-full">
            <Typography.Caption className="text-subheading text-base">
              Current Collateral
            </Typography.Caption>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full pb-4 px-10">
          <div
            className="flex flex-col flex-shrink-0 max-w-[350px] h-[370px] px-6"
            data-tooltip-id="chart"
            data-tooltip-offset={-20}
            data-tooltip-content={hovered}
          >
            <PieChart
              data={piechartData}
              lineWidth={15}
              startAngle={270}
              paddingAngle={1}
              onMouseOver={(_, index) => {
                setHovered(index);
              }}
              onMouseOut={() => {
                setHovered(null);
              }}
            />
            <ReactTooltip
              id="chart"
              style={{
                backgroundColor: "#141519",
                border: "1px solid #252833",
                borderRadius: 8,
              }}
              render={() => {
                return typeof hovered === "number"
                  ? makeTooltipContent(piechartData?.[hovered])
                  : null;
              }}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-2">
            {data.map(({ label, color, total }) => (
              <div
                key={label}
                className="flex flex-row bg-origin-bg-black bg-opacity-50 rounded-md p-4"
              >
                <div className="flex flex-row space-x-4">
                  <div
                    className="relative top-[6px] flex items-start w-[8px] h-[8px] rounded-full"
                    style={{
                      background: color,
                    }}
                  />
                  <div className="flex flex-col space-y-1">
                    <Typography.Caption>{label}</Typography.Caption>
                    <Typography.Caption>
                      {formatPercentage(total / totalSum)}
                    </Typography.Caption>
                    <Typography.Caption className="text-subheading">
                      {formatCurrency(total, 2)}
                    </Typography.Caption>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ErrorBoundary>
    </LayoutBox>
  ) : null;
};

const Analytics = ({ collateral, tvl, tvlUsd }) => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Overview</title>
      </Head>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <APYChartContainer />
        </div>
        <div className="col-span-12">
          <TotalSupplyChartContainer />
        </div>
        <div className="col-span-12">
          <CurrentCollateralContainer
            data={collateral}
            tvl={tvl}
            tvlUsd={tvlUsd}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props;
}> => {
  const [allocation, { collateral }] = await Promise.all([
    fetchAllocation(),
    fetchCollateral(),
  ]);
  return {
    props: {
      tvl: allocation.total_supply,
      tvlUsd: allocation.total_value_usd,
      collateral: orderBy(
        aggregateCollateral({ collateral, allocation }),
        "total",
        "desc"
      ),
    },
  };
};

export default Analytics;

Analytics.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
