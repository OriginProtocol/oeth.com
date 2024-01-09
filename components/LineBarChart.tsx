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
  bars: number[];
  barLabel: string;
  barFormat?: (value: number) => string;
  barColor?: string;
  lines: number[];
  lineLabel: string;
  lineFormat?: (value: number) => string;
  lineColor?: string;
  tooltip?: React.ComponentProps<typeof Chart>["options"]["plugins"]["tooltip"];
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
        ticks: {
          callback: data.barFormat,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          callback: data.lineFormat,
          color: "#B5BECA",
        },
        grid: {
          color: "#69696921",
          tickBorderDash: () => [2],
          tickBorderDashOffset: 4,
        },
      },
    },
    plugins: {
      tooltip: {
        titleColor: "#B5BECA",
        bodyColor: "#B5BECA",
        ...data.tooltip,
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
        label: data.lineLabel,
        yAxisID: "y1",
        data: data.lines,
        borderColor: data.lineColor ?? "#48E4DB",
        backgroundColor: data.lineColor ?? "#48E4DB",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: data.barLabel,
        yAxisID: "y",
        data: data.bars,
        backgroundColor: data.barColor ? `${data.barColor}33` : "#586CF833",
        hoverBackgroundColor: data.barColor ?? "#586CF8",
      },
    ],
  };

  return <Chart type="bar" options={options} data={chartData} />;
};

export default LineBarChart;
