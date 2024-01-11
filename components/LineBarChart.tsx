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
  TimeScaleTimeOptions,
  ChartTypeRegistry,
  TooltipOptions,
} from "chart.js";
import "chartjs-adapter-moment";
import { Chart } from "react-chartjs-2";
import { DeepPartial } from "ts-essentials";

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

interface LineBarChartProps {
  dates: string[]; // Array of date strings
  dateTimeScaleOptions: Partial<TimeScaleTimeOptions>;
  bars: number[];
  barLabel: string;
  barFormat?: (value: number) => string;
  barColor?: string;
  lines: number[];
  lineLabel: string;
  lineFormat?: (value: number) => string;
  lineColor?: string;
  tooltip?: DeepPartial<TooltipOptions<keyof ChartTypeRegistry>>;
}

const LineBarChart: React.FC<LineBarChartProps> = (props) => {
  const options: React.ComponentProps<typeof Chart>["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      x: {
        type: "time",
        grid: {
          display: false,
        },
        time: props.dateTimeScaleOptions,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 50,
          source: "labels",
          maxTicksLimit: 6,
          align: "start",
          labelOffset: 5,
          color: "#B5BECA",
          maxRotation: 0,
        },
      },
      y: {
        type: "linear",
        display: false,
        position: "left",
        ticks: {
          callback: props.barFormat,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          callback: props.lineFormat,
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
        ...props.tooltip,
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
    labels: props.dates,
    datasets: [
      {
        type: "line",
        label: props.lineLabel,
        yAxisID: "y1",
        data: props.lines,
        borderColor: props.lineColor ?? "#48E4DB",
        backgroundColor: props.lineColor ?? "#48E4DB",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: props.barLabel,
        yAxisID: "y",
        data: props.bars,
        backgroundColor: props.barColor ? `${props.barColor}33` : "#586CF833",
        hoverBackgroundColor: props.barColor ?? "#586CF8",
      },
    ],
  };

  return <Chart type="bar" options={options} data={chartData} />;
};

export default LineBarChart;
