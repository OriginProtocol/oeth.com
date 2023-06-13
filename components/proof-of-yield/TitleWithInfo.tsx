import React, { PropsWithChildren, useRef, useState } from "react";
import Image from "next/image";
import { assetRootPath } from "../../utils";
import { twMerge } from "tailwind-merge";
import { Typography } from "@originprotocol/origin-storybook";
import { useOutOfBoundsClick } from "../../hooks";

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
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltip = useRef<HTMLDivElement>(null);

  useOutOfBoundsClick(tooltip, () => setShowTooltip(false));

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
      <div
        className="relative group flex items-center"
        ref={tooltip}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => !showTooltip && setShowTooltip(true)}
      >
        <Image
          src={assetRootPath(
            `/images/${whiteTooltip ? "info-white.svg" : "info.png"}`
          )}
          width="16"
          height="16"
          alt="info"
          className="inline min-w-[12px] min-h-[12px] max-w-[12px] max-h-[12px] w-[12px] h-[12px] md:min-w-[16px] md:min-h-[16px] md:max-w-[16px] md:max-h-[16px] md:w-[16px] md:h-[16px]"
        />
        <div
          className={`${
            showTooltip ? "visible" : "hidden"
          } tooltip-shadow absolute bottom-0 left-0 -translate-x-1/2 -translate-y-[26px] border border-tooltip-border text-xs text-origin-white min-w-[120px] md:min-w-[180px] bg-origin-bg-black break-normal whitespace-break-spaces rounded-lg px-2 md:px-4 py-2 md:py-3 text-left`}
        >
          {info}
        </div>
      </div>
    </div>
  );
};

export default TitleWithInfo;
