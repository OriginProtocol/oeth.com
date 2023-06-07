import { format, isAfter, subMonths, subWeeks } from "date-fns";
import { isMobile } from "react-device-detect";
import { ChartOptions } from "chart.js";
import { slice } from "lodash";

export const backingTokens = {
  OETH: {
    label: "OETH",
    logoSrc: "/images/oeth-icon.svg",
    color: "#3390f3",
  },
  ETH: {
    label: "ETH",
    logoSrc: "/images/eth-icon.svg",
    color: "#5b7fff",
  },
  WETH: {
    label: "Wrapped Ether (WETH)",
    logoSrc: "/images/weth-icon.svg",
    color: "#d0246a",
  },
  FRXETH: {
    label: "Frax ETH (frxETH)",
    logoSrc: "/images/frax-icon.svg",
    color: "#e85bff",
  },
  RETH: {
    label: "Rocket Pool ETH (rETH)",
    logoSrc: "/images/reth-icon.svg",
    color: "#ffc298",
  },
  STETH: {
    label: "Lido Staked ETH (stETH)",
    logoSrc: "/images/steth-icon.svg",
    color: "#66c8ff",
  },
};

export const durationOptions = [
  {
    value: "1w",
    label: "1W",
  },
  {
    value: "1m",
    label: "1M",
  },
  {
    value: "6m",
    label: "6M",
  },
  {
    value: "12m",
    label: "1YR",
  },
  {
    value: "all",
    label: "All",
  },
];

export const typeOptions = [
  {
    value: "",
    label: "All",
  },
  {
    value: "_7_day",
    label: "7-Day",
  },
  {
    value: "_14_day",
    label: "14-Day",
  },
  {
    value: "_30_day",
    label: "30-Day",
  },
  {
    value: "total",
    label: "Current",
  },
];

export const createGradient =
  (colors) =>
  ({ chart }) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return;
    }
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      chartArea.right,
      0
    );
    colors.forEach((color, index) => {
      gradient.addColorStop(index, color);
    });
    return gradient;
  };

export const barFormatting = {
  backgroundColor: createGradient(["#426EF7", "#426EF7"]),
};

export const borderFormatting = {
  borderColor: createGradient(["#FEDBA8", "#CF75D5"]),
  borderWidth: 2,
  tension: 0,
  borderJoinStyle: "round",
  pointRadius: 0,
  pointHitRadius: 1,
};

export const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  aspectRatio: isMobile ? 1 : 3,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
  },
  interaction: {
    mode: "nearest",
    intersect: false,
    axis: "x",
  },
  scales: {
    x: {
      border: {
        color: "#4d505e",
        width: 0.5,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: "#828699",
        autoSkip: false,
        maxRotation: 90,
        minRotation: 0,
        padding: 20,
        callback: function (val, index) {
          return (isMobile ? (index + 22) % 4 === 0 : (index + 8) % 3 === 0)
            ? this.getLabelForValue(Number(val))
            : null;
        },
      },
    },
    y: {
      border: {
        display: false,
        dash: [2, 4],
        dashOffset: 1,
      },
      grid: {
        color: "#4d505e",
        lineWidth: 0.5,
      },
      beginAtZero: true,
      position: "right",
      ticks: {
        color: "#828699",
        callback: function (val) {
          return val === 0 ? null : this.getLabelForValue(Number(val));
        },
      },
    },
  },
};

export const aggregateCollateral = ({ collateral, allocation }) => {
  const aggregateTotal = collateral?.reduce((t, s) => ({
    total: Number(t?.total || 0) + Number(s?.total || 0),
  })).total;

  return collateral.reduce((acc, token) => {
    const { name } = token;
    const normalizedTokenName = name?.toUpperCase();

    if (!Object.keys(backingTokens).includes(normalizedTokenName)) {
      return acc;
    }

    const localTotal = Number(token?.total || 0);

    acc[normalizedTokenName] = {
      total: localTotal,
      percentage: localTotal / aggregateTotal,
      // Add in meta information
      ...backingTokens[normalizedTokenName],
    };

    return acc;
  }, {});
};

export const sumOfDifferences = (data) => {
  return data
    .sort((a, b) => b - a)
    .reduce((acc, curr, index, array) => {
      const next = array[index + 1];
      if (!isNaN(curr - next)) {
        acc += curr - next;
      }
      return acc;
    }, 0);
};

export const sumOf = (data) => {
  return data?.reduce((acc, curr) => {
    if (!isNaN(curr)) {
      acc += curr;
    }
    return acc;
  }, 0);
};

const formatMonthDay = (d) => format(new Date(d), "MMM do");

export const formatLabels = (labels) => labels?.map(formatMonthDay);

export const formatDisplay = ({ labels, datasets }) => ({
  labels: labels ? formatLabels(labels) : [],
  datasets: datasets || [],
});

export const filterByDuration = (data, duration = "all") => {
  if (duration === "all") return data;
  const { labels, datasets } = data;
  const firstValidIndex = labels.findIndex((date) => {
    const [sub] = duration.match(/(\d+)/);
    const amount = sub ? parseInt(sub, 10) : 0;
    const now = new Date();
    const lowerBound = duration.includes("w")
      ? subWeeks(now, amount)
      : duration.includes("m")
      ? subMonths(now, amount)
      : now;
    return isAfter(new Date(date), lowerBound);
  });
  return {
    labels: slice(labels, firstValidIndex),
    datasets: datasets?.map((dataset) => ({
      ...dataset,
      data: slice(dataset?.data, firstValidIndex),
    })),
  };
};
