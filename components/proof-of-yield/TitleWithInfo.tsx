import React, { PropsWithChildren, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Typography } from "@originprotocol/origin-storybook";
import Tooltip from "./Tooltip";

interface TitleWithInfoProps {
  className?: string;
  textClassName?: string;
  whiteTooltip?: boolean;
  info: string;
}

const TitleWithInfo = ({
  className,
  textClassName,
  info,
  whiteTooltip,
  children,
}: PropsWithChildren<TitleWithInfoProps>) => {
  return (
    <div
      className={twMerge(
        `font-normal text-table-title w-fit flex items-center`,
        className
      )}
    >
      <Typography.Body2
        className={twMerge(
          `text-xs md:text-base pr-1 md:pr-2 whitespace-nowrap`,
          textClassName
        )}
      >
        {children}
      </Typography.Body2>
      <Tooltip info={info} whiteTooltip={whiteTooltip} />
    </div>
  );
};

export default TitleWithInfo;
