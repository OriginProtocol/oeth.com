import { useMemo, useState, useEffect } from "react";
import {
  borderFormatting,
  filterByDuration,
  formatDisplay,
} from "../../utils/analytics";
import { fetchWOETHHistory } from "../../utils";

export const useWOETHChart = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
    error: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await fetchWOETHHistory(360);
        const data = {
          labels: json.pctWOETH.map((item) => item.day),
          datasets: [
            {
              id: "_pct",
              label: "% wrapped OETH",
              data: json.pctWOETH.map((item) => item.pct),
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
    typeOf: "_pct",
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
