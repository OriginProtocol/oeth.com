import { useQuery } from "react-query";
import { useMemo } from "react";

export const useCollateralChart = () => {
  const { data, isFetching } = useQuery(`/api/analytics/charts/collateral`, {
    initialData: {
      collateral: [],
      tvl: 0,
      tvlUsd: 0,
      error: null,
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const { collateral, tvl, tvlUsd } = data;

  const chartData = useMemo(() => {
    return {
      labels: collateral.map((item) => item.label),
      datasets: [
        {
          label: "Current Collateral",
          data: collateral.map((item) => item.total),
          unitData: collateral.map((item) => item.unitTotal),
          symbol: collateral.map((item) => item.symbol),
          token: collateral.map((item) => item.token),
          backgroundColor: collateral.map((item) => item.color),
          borderWidth: 0,
          hoverOffset: 50,
        },
      ],
    };
  }, [JSON.stringify(collateral)]);

  const totalSum = useMemo(() => {
    return collateral.reduce((acc, item) => {
      acc += Number(item.total || 0);
      return acc;
    }, 0);
  }, [JSON.stringify(collateral)]);

  const piechartData = useMemo(() => {
    return chartData?.datasets?.[0]?.data.map((value, index) => {
      const token = chartData?.labels?.[index];
      const color = chartData?.datasets?.[0]?.backgroundColor[index];
      const symbol = chartData?.datasets?.[0]?.symbol[index];
      return {
        title: token,
        value,
        unitValue: chartData?.datasets?.[0]?.unitData[index],
        token: chartData?.datasets?.[0]?.token[index],
        color,
        symbol,
      };
    });
  }, [JSON.stringify(chartData)]);

  return [
    {
      data: piechartData,
      collateral,
      tvl,
      tvlUsd,
      totalSum: totalSum,
      isFetching,
    },
  ];
};
