import React, { PropsWithChildren } from "react";
import Image from "next/image";
import { GradientButton } from "../../../components";
import { useViewWidth } from "../../../hooks";
import { lgSize } from "../../../constants";
import { assetRootPath } from "../../../utils";

interface ChartDetailsButtonProps {
  onClick: () => void;
}

const ChartDetailsButton = ({
  onClick,
  children,
}: PropsWithChildren<ChartDetailsButtonProps>) => {
  const width = useViewWidth();

  return (
    <>
      {width >= lgSize ? (
        <GradientButton
          onClick={onClick}
          className="bg-origin-bg-grey w-full group-hover:bg-[#1b1a1abb] text-sm"
        >
          <span>{children}</span>
          <Image
            src={assetRootPath("/images/arrow-right.svg")}
            width="20"
            height="20"
            alt="arrow-right"
            className="pl-3 inline translate-y-[-1px]"
          />
        </GradientButton>
      ) : (
        <button
          onClick={onClick}
          className="w-3 mx-0 flex justify-end items-center"
        >
          <Image
            width="7"
            height="7"
            src={assetRootPath("/images/arrow.svg")}
            alt="arrow"
          />
        </button>
      )}
    </>
  );
};

export default ChartDetailsButton;
