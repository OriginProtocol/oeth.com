import withIsMobile from "../../hoc/withIsMobile";
import { Line } from "react-chartjs-2";

const LineChart = ({ chartData, isMobile }) => {
  return (
    <div>
      <Line
        data={chartData}
        options={{
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
              bodySpacing: 10,
              padding: 10,
              borderColor: "#8493a6",
              borderWidth: 1,
              bodyFont: { size: 32 },
              titleColor: "#b5beca",
              titleFont: { size: 16 },
              displayColors: false,
              backgroundColor: "#1e1f25C0",
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.formattedValue + "%";
                },
              },
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
                color: "#8493a6",
              },
              grid: {
                display: false,
                // @ts-ignore
                borderColor: "#8493a6",
                borderWidth: 2,
              },
              ticks: {
                color: "#b5beca",
                autoSkip: false,
                maxRotation: 90,
                minRotation: 0,
                callback: function (val, index) {
                  return (
                    isMobile ? (index + 22) % 14 === 0 : (index + 8) % 7 === 0
                  )
                    ? this.getLabelForValue(Number(val))
                    : null;
                },
              },
            },
            y: {
              border: {
                display: false,
              },
              grid: {
                display: false,
              },
              beginAtZero: true,
              position: "right",
              ticks: {
                maxTicksLimit: 6,
                color: "#b5beca",
                callback: function (val) {
                  return val === 0
                    ? null
                    : this.getLabelForValue(Number(val)) + "%";
                },
                crossAlign: "far",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default withIsMobile(LineChart);
