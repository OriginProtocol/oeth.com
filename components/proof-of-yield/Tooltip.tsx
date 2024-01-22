import Image from "next/image";
import { useRef, useState } from "react";
import { useOutOfBoundsClick } from "../../hooks";
import { assetRootPath } from "../../utils";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  info: string;
  whiteTooltip?: boolean;
  wrapClassName?: string;
  className?: string;
  tooltipClassName?: string;
}

const Tooltip = ({
  info,
  whiteTooltip,
  wrapClassName,
  className,
  tooltipClassName,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltip = useRef<HTMLDivElement>(null);

  useOutOfBoundsClick(tooltip, () => setShowTooltip(false));
  return (
    <div
      className={twMerge("relative group flex items-center", wrapClassName)}
      ref={tooltip}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => !showTooltip && setShowTooltip(true)}
    >
      <Image
        src={assetRootPath(
          `/images/${whiteTooltip ? "info-white.svg" : "info.png"}`,
        )}
        width="16"
        height="16"
        alt="info"
        className={twMerge(
          `inline min-w-[12px] min-h-[12px] max-w-[12px] max-h-[12px] w-[12px] h-[12px] md:min-w-[16px] md:min-h-[16px] md:max-w-[16px] md:max-h-[16px] md:w-[16px] md:h-[16px]`,
          className,
        )}
      />
      <div
        className={twMerge(
          `${
            showTooltip ? "visible" : "hidden"
          } tooltip-shadow absolute bottom-0 left-0 -translate-x-1/2 -translate-y-[26px] border border-tooltip-border text-xs text-origin-white min-w-[120px] md:min-w-[180px] bg-origin-bg-black break-normal whitespace-break-spaces rounded-lg px-2 md:px-4 py-2 md:py-3 text-left`,
          tooltipClassName,
        )}
      >
        {info}
      </div>
    </div>
  );
};

export default Tooltip;
