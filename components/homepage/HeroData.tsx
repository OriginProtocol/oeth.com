import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { twMerge } from "tailwind-merge";

interface HeroDataProps {
  title: string;
  value: string;
  className?: string;
}

const HeroData = ({ title, value, className }: HeroDataProps) => {
  return (
    <div
      className={twMerge(
        "py-4 md:py-12 px-12 md:px-[100px] border border-[#ffffff1a] text-center",
        className
      )}
    >
      <Typography.Body>{title}</Typography.Body>
      <Typography.H5 className="font-bold text-xl md:text-4xl mt-2">
        {value}
      </Typography.H5>
    </div>
  );
};

export default HeroData;
