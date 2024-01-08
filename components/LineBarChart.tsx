import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeSeriesScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-moment";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
  TimeSeriesScale,
);

interface ChartData {
  dates: string[]; // Array of date strings
  earnings: number[]; // Array of earnings (ETH)
  apy: number[]; // Array of APY (%)
}

interface MixedChartProps {
  data: ChartData;
}

const LineBarChart: React.FC<MixedChartProps> = ({ data }) => {
  const options: React.ComponentProps<typeof Chart>["options"] = {
    responsive: true,
    layout: {
      autoPadding: false,
      padding: {
        left: 0,
        right: 4,
        top: 0,
        bottom: 5,
      },
    },
    scales: {
      x: {
        type: "time",
        grid: {
          display: false,
        },
        time: {
          unit: "month",
          displayFormats: {
            month: "MMM YY",
          },
        },
        ticks: {
          autoSkip: true,
          autoSkipPadding: 50,
          source: "labels",
          maxTicksLimit: 6,
          align: "start",
          labelOffset: 5,
          color: "#B5BECA",
        },
      },
      y: {
        type: "linear",
        display: false,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          callback: (percentage: number) => `${(percentage * 100).toFixed(1)}%`,
          color: "#B5BECA",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const { dataset, raw } = context;
            const value = Number(raw);
            if (dataset.label === "APY") {
              return `${dataset.label}: ${(value * 100).toFixed(1)}%`;
            } else {
              return `${dataset.label}: ${value.toLocaleString("en-US", {
                notation: "compact",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
            }
          },
        },
      },
      legend: {
        display: false,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.5,
      },
      point: {
        radius: 0,
      },
    },
  } as const;

  const chartData: React.ComponentProps<typeof Chart>["data"] = {
    labels: data.dates,
    datasets: [
      {
        type: "line",
        label: "APY",
        yAxisID: "y1",
        data: data.apy,
        borderColor: "#48E4DB",
        backgroundColor: "#48E4DB",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Earnings",
        yAxisID: "y",
        data: data.earnings,
        backgroundColor: "#586CF833",
        hoverBackgroundColor: "#586CF8",
      },
    ],
  };

  return <Chart type="bar" options={options} data={chartData} />;
};

export default LineBarChart;
