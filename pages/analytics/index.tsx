import Head from "next/head";
import { Line, Doughnut } from "react-chartjs-2";
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
import { ErrorBoundary, LayoutBox, TwoColumnLayout } from "../../components";
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
import { useMemo } from "react";

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
      loadingClassName="flex items-center justify-center h-[350px] w-full"
      isLoading={isFetching}
    >
      <div className="flex flex-row justify-between w-full h-[150px] p-4 md:p-6">
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
        <div className="flex flex-row justify-between w-full h-[210px] p-4 md:p-6">
          <div className="flex flex-col w-full h-full">
            <Typography.Caption className="text-subheading">
              Total Supply
            </Typography.Caption>
            <Typography.H4>{`Ξ ${formatCurrency(
              last(data?.datasets?.[0]?.data) || 0,
              4
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

const CurrentCollateralContainer = ({ data, tvl, tvlUsd }) => {
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

  return data ? (
    <LayoutBox
      className="min-h-[370px]"
      loadingClassName="flex items-center justify-center w-full h-[470px]"
    >
      <ErrorBoundary>
        <div className="flex flex-row justify-between w-full h-[80px] p-4 md:p-6">
          <div className="flex flex-col w-full h-full">
            <Typography.Caption className="text-subheading">
              Current Collateral
            </Typography.Caption>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full pb-4">
          <div className="flex flex-col items-center justify-center flex-shrink-0 w-full h-[450px] px-6">
            <Doughnut
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: false,
                  },
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                  },
                },
                cutout: "75%",
              }}
              data={chartData}
            />
          </div>
          <div className="flex flex-col flex-shrink-0 w-full h-full space-y-2 px-6">
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
                      Ξ {formatCurrency(total, 2)}
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
