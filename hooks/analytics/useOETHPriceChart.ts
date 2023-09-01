import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import {
  borderFormatting,
  filterByDuration,
  formatDisplay,
} from "../../utils/analytics";

export const useOETHPriceChart = () => {
  const { data, isFetching } = useQuery(`/api/analytics/charts/oeth-peg`, {
    initialData: {
      labels: [],
      datasets: [],
      error: null,
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const [chartState, setChartState] = useState({
    duration: "all",
  });

  const chartData = useMemo(() => {
    if (data?.error) {
      return null;
    }
    return formatDisplay(
      filterByDuration(
        {
          labels: data?.labels,
          datasets: data?.datasets?.reduce((acc, dataset) => {
            acc.push({
              ...dataset,
              ...borderFormatting,
            });
            return acc;
          }, []),
        },
        chartState?.duration
      )
    );
  }, [JSON.stringify(data), chartState?.duration]);

  const onChangeFilter = (value) => {
    setChartState((prev) => ({
      ...prev,
      ...value,
    }));
  };

  return [
    {
      data: chartData,
      filter: chartState,
      isFetching,
    },
    { onChangeFilter },
  ];
};
