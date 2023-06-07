import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { GradientButton, LineChart } from "../../components";
import { Typography } from "@originprotocol/origin-storybook";
import { formatCurrency } from "../../utils/math";
import { apyDayOptions, mdSize } from "../../constants";
import { CategoryScale, ChartData } from "chart.js";
import { Section } from "../../components";
import { ApyHistory } from "../../types";
import { twMerge } from "tailwind-merge";
import { Dictionary } from "lodash";
import { useApyHistoryQuery } from "../../queries";
import { useViewWidth } from "../../hooks";

ChartJS.register(CategoryScale);
interface ApyProps {
  daysToApy: Dictionary<number>;
  apyData: ApyHistory;
  sectionOverrideCss?: string;
}

const Apy = ({ daysToApy, apyData, sectionOverrideCss }: ApyProps) => {
  const [loaded, setLoaded] = useState(false);
  const [apyDays, setApyDays] = useState(30);

  const apyHistoryQuery = useApyHistoryQuery(apyData);

  const apyHistory = useMemo(
    () => apyHistoryQuery.data,
    [apyHistoryQuery.isSuccess, apyHistoryQuery.data]
  );

  const viewWidth = useViewWidth();

  const [chartData, setChartData] = useState<ChartData<"line">>();
  const dataReversed =
    apyHistory && apyHistory[`apy${apyDays}`]
      ? apyHistory[`apy${apyDays}`]
      : [];
  const data = dataReversed.slice().reverse();

  useEffect(() => {
    apyHistoryQuery.refetch();
  }, []);

  useEffect(() => {
    localStorage.setItem("last_user_selected_apy", String(apyDays));
    setLoaded(true);
  }, [apyDays]);

  let width, height, gradient;
  function getGradient(ctx, chartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(
        0,
        chartArea.left,
        chartArea.right,
        0
      );
      gradient.addColorStop(0, "#b361e6");
      gradient.addColorStop(1, "#6a36fc");
    }
    return gradient;
  }

  useEffect(() => {
    if (data.length === 0) return;
    else {
      setChartData({
        // @ts-ignore
        label: "APY",
        labels: data.map((d) => new Date(d.day).toString().slice(4, 10)),
        datasets: [
          {
            data: data.map((d) => d.trailing_apy),
            borderColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                return;
              }
              return getGradient(ctx, chartArea);
            },
            borderWidth: viewWidth < mdSize ? 2 : 5,
            tension: 0,
            borderJoinStyle: "round",
            pointRadius: 0,
            pointHitRadius: 1,
          },
        ],
      });
    }
  }, [apyHistory, apyDays]);

  return (
    <Section
      className={twMerge("bg-origin-bg-grey text-center", sectionOverrideCss)}
      innerDivClassName="py-14 md:py-[120px]"
    >
      <Typography.H6
        className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
        style={{ fontWeight: 500 }}
      >
        <span className="text-gradient2 py-1">Real yield </span>
        diversified{" "}
      </Typography.H6>
      <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto !leading-[23px] md:!leading-[28px] text-subheading text-sm md:text-base">
        OETH sustainably outperforms other ETH staking strategies and limits
        exposure to any single LSD.
      </Typography.Body3>
      {loaded && (
        <div className="max-w-[1432px] mx-auto flex flex-col mt-10 md:mt-20 mb-10 md:mb-20 p-[16px] py-[32px] md:p-10 rounded-xl bg-origin-bg-black">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="mt-[0px] md:mt-[16px]">
              <Typography.H2 className="font-bold xl:inline lg:text-left text-6xl">
                {formatCurrency(
                  // @ts-ignore
                  daysToApy[apyDays] * 100,
                  2
                ) + "% "}
              </Typography.H2>
              <Typography.H7 className="text-sm font-normal md:text-2xl text-subheading mt-[4px] xl:mt-0 xl:inline lg:text-left opacity-70">{`Trailing ${apyDays}-day APY`}</Typography.H7>
            </div>
            <div className="flex flex-col mt-6 lg:mt-0 mx-[auto] lg:mx-0">
              <Typography.Body3 className="text-sm md:text-base text-subheading">
                Moving average
              </Typography.Body3>
              <div className="flex flex-row justify-between mt-[12px]">
                {apyDayOptions.map((days) => {
                  return (
                    <div
                      className={`${
                        apyDays === days ? "gradient2" : "bg-origin-bg-grey"
                      } w-[90px] sm:w-[135px] p-px rounded-lg text-center cursor-pointer mr-2 hover:opacity-90`}
                      key={days}
                      onClick={() => {
                        setApyDays(days);
                      }}
                    >
                      <div className="bg-origin-bg-grey w-full rounded-lg">
                        <div
                          className={`w-full py-[13px] rounded-lg ${
                            apyDays === days ? "gradient4" : "text-subheading"
                          }`}
                        >
                          <Typography.Body3
                            className={`text-xs ${
                              apyDays === days
                                ? "text-origin-white font-medium"
                                : "text-subheading"
                            }`}
                          >{`${days}-day`}</Typography.Body3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {chartData && (
            <div className="mt-12 md:ml-[0px]">
              <LineChart chartData={chartData} />
            </div>
          )}
        </div>
      )}
      {process.env.NEXT_PUBLIC_UNREADY_COMPONENTS && (
        <div className="px-4 md:px-0">
          <GradientButton
            outerDivClassName="w-full md:w-fit md:mx-auto  hover:bg-transparent hover:opacity-90"
            className="bg-transparent py-[14px] md:py-5 md:px-20 lg:px-20 hover:bg-transparent"
            elementId="btn-apy-app"
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_DAPP_URL,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <Typography.H7 className="font-normal">
              Start earning now
            </Typography.H7>
          </GradientButton>
        </div>
      )}
    </Section>
  );
};

export default Apy;
