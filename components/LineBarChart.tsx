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
} from "chart.js";
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
  const options = {
    responsive: true,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const { dataset, raw } = context;
            return `${dataset.label}: ${raw}`;
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
        type: "bar",
        label: "Earnings",
        yAxisID: "y",
        data: data.earnings,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        type: "line",
        label: "APY",
        yAxisID: "y1",
        data: data.apy,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Chart type="bar" options={options} data={chartData} />;
};

export default LineBarChart;
