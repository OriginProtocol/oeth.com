import { Typography } from "@originprotocol/origin-storybook";
import { commify } from "ethers/lib/utils";
import React from "react";
import { Section, BasicData } from "../../components";

type DripperData = {
  fundsHeld: number;
  available: number;
  ratePerDay: number;
  ratePerHour: number;
  ratePerMinute: number;
};

interface DripperBasicStats {
  data: DripperData;
  className?: string;
}

const DripperBasicStats = ({ className, data }: DripperBasicStats) => {
  return (
    <Section className={className} innerDivClassName="max-w-full">
      <div className="flex flex-col space-y-6 max-w-6xl">
        <div className="flex flex-col space-y-2">
          <Typography.Body className="font-sans text-[16px]">
            Dripper funds
          </Typography.Body>
          <div className="flex flex-col space-y-1 lg:space-y-0 lg:flex-row items-center w-full">
            <BasicData
              className="rounded-0 lg:rounded-l-lg flex-1"
              title="Funds held by dripper"
            >
              {commify(data?.fundsHeld)} OETH
            </BasicData>
            <BasicData
              className="rounded-0 lg:rounded-r-lg flex-1"
              title="Available for collection"
            >
              {commify(data?.available)}
            </BasicData>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Typography.Body>Drip rate</Typography.Body>
          <div className="flex flex-col space-y-1 lg:space-y-0 lg:flex-row items-center w-full">
            <BasicData
              className="rounded-0 lg:rounded-l-lg flex-1"
              title="Per day"
            >
              {commify(data?.ratePerDay)} OETH
            </BasicData>
            <BasicData className="flex-1" title="Per hour">
              {commify(data?.ratePerHour)} OETH
            </BasicData>
            <BasicData
              className="rounded-0 lg:rounded-r-lg flex-1"
              title="Per minute"
            >
              {commify(data?.ratePerMinute)} OETH
            </BasicData>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default DripperBasicStats;
