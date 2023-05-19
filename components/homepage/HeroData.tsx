import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { twMerge } from "tailwind-merge";

interface HeroDataProps {
  title: string;
  value: string;
  subtext: string;
  className?: string;
}

const HeroData = ({ title, value, subtext, className }: HeroDataProps) => {
  return (
    <div
      className={twMerge(
        "py-4 md:py-8 border border-[#ffffff1a] text-center leading-[28px] md:leading-[32px] w-1/2 bg-origin-bg-blackt",
        className
      )}
    >
      <Typography.Body>{title}</Typography.Body>
      <Typography.H5 className="font-bold text-2xl md:text-[40px] leading-[32px] md:leading-[48px]">
        {value}
      </Typography.H5>
      <Typography.Body2 className="mt-1 text-subheading text-xs md:text-sm">
        {subtext}
      </Typography.Body2>
    </div>
  );
};

export default HeroData;
