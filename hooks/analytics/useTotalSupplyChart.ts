import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import {
  borderFormatting,
  createGradient,
  filterByDuration,
  formatDisplay,
} from "../../utils/analytics";

export const useTotalSupplyChart = () => {
  const { data, isFetching } = useQuery("/api/analytics/charts/totalSupply", {
    initialData: {
      labels: [],
      datasets: [],
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const [chartState, setChartState] = useState({
    duration: "all",
  });

  const gradients = [
    [createGradient(["#FEDBA8", "#CF75D5"]), "#CF75D5"],
    [createGradient(["#8C66FC", "#0274F1"]), "#0274F1"],
  ];

  const chartData = useMemo(() => {
    return formatDisplay(
      filterByDuration(
        {
          labels: data?.labels || [],
          // Remove total supply
          datasets:
            data?.datasets?.reduceRight((acc, dataset, index) => {
              acc.push({
                ...dataset,
                ...borderFormatting,
                borderWidth: 0,
                backgroundColor: gradients[index][0],
                backgroundColorSimple: gradients[index][1],
                fill: true,
              });
              return acc;
            }, []) || [],
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
