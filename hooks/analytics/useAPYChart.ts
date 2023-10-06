import { useMemo, useState, useEffect } from "react";
import {
  borderFormatting,
  filterByDuration,
  formatDisplay,
} from "../../utils/analytics";
import { fetchApyHistory } from "../../utils";

export const useAPYChart = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
    error: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await fetchApyHistory(360);
        const data = {
          labels: json.apy7.map((item) => item.day),
          datasets: [
            {
              id: "_7_day",
              label: "7 Day MA",
              data: json.apy7.map((item) => item.trailing_apy),
            },
            {
              id: "_30_day",
              label: "30 Day",
              data: json.apy30.map((item) => item.trailing_apy),
            },
          ],
          error: null,
        };
        setData(data);
        setIsFetching(false);
      } catch (err) {
        console.log(`Failed to fetch APY stats: ${err}`);
      }
    };
    fetchData();
  }, []);

  const [chartState, setChartState] = useState({
    duration: "all",
    typeOf: "_30_day",
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
            if (!chartState?.typeOf || dataset.id === chartState?.typeOf) {
              acc.push({
                ...dataset,
                ...borderFormatting,
              });
            }
            return acc;
          }, []),
        },
        chartState?.duration,
      ),
    );
  }, [JSON.stringify(data), chartState?.duration, chartState?.typeOf]);

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
