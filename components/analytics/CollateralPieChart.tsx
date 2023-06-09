import React, { useState } from "react";
import { Typography } from "@originprotocol/origin-storybook";
import { PieChart } from "react-minimal-pie-chart";
import { Tooltip } from "react-tooltip";
import { formatCurrency, formatPercentage } from "../../utils";
import { useCollateralChart } from "../../hooks/analytics/useCollateralChart";
import ErrorBoundary from "../ErrorBoundary";
import LayoutBox from "../LayoutBox";

const makeTooltipContent = ({ tooltip, value }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-origin-bg-black">
      <Typography.Caption>{tooltip}</Typography.Caption>
      <Typography.Caption>{formatCurrency(value, 2)}</Typography.Caption>
    </div>
  );
};

const CollateralPieChart = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [{ data, totalSum, collateral, isFetching }] = useCollateralChart();
  return (
    <LayoutBox
      className="min-h-[370px]"
      loadingClassName="flex items-center justify-center w-full h-[370px]"
      isLoading={isFetching}
    >
      <ErrorBoundary>
        <div className="flex flex-row justify-between w-full h-[80px] p-4 md:p-6">
          <div className="flex flex-col w-full h-full">
            <Typography.Caption className="text-subheading text-base">
              Current Collateral
            </Typography.Caption>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full pb-4 px-6 lg:px-10">
          {/* @ts-ignore */}
          <div
            className="flex flex-col flex-shrink-0 max-w-[350px] px-6 pb-[26px]"
            data-tooltip-id="chart"
            data-tooltip-content={hovered}
          >
            <PieChart
              data={data}
              lineWidth={15}
              startAngle={270}
              paddingAngle={1}
              onMouseOver={(_, index) => {
                setHovered(index);
              }}
              onMouseOut={() => {
                setHovered(null);
              }}
            />
            <Tooltip
              id="chart"
              style={{
                backgroundColor: "#141519",
                border: "1px solid #252833",
                borderRadius: 8,
              }}
              render={() => {
                return typeof hovered === "number"
                  ? makeTooltipContent(data?.[hovered])
                  : null;
              }}
              float
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-2">
            {collateral.map(({ label, color, total }) => (
              <div
                key={label}
                className="flex flex-row bg-origin-bg-black bg-opacity-50 rounded-md p-4"
              >
                <div className="flex flex-row space-x-4">
                  <div
                    className="relative top-[6px] flex items-start w-[8px] h-[8px] rounded-full"
                    style={{
                      background: color,
                    }}
                  />
                  <div className="flex flex-col space-y-1">
                    <Typography.Caption>{label}</Typography.Caption>
                    <Typography.Caption>
                      {formatPercentage(total / totalSum)}
                    </Typography.Caption>
                    <Typography.Caption className="text-subheading">
                      {formatCurrency(total, 2)}
                    </Typography.Caption>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ErrorBoundary>
    </LayoutBox>
  );
};

export default CollateralPieChart;
