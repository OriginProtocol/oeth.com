import Image from "next/image";
import { assetRootPath } from "../../utils";
import { Typography } from "@originprotocol/origin-storybook";
import { twMerge } from "tailwind-merge";

interface CollateralItemProps {
  img: string;
  tokenName: string;
  symbol: string;
  className?: string;
}

const CollateralItem = ({
  img,
  tokenName,
  symbol,
  className,
}: CollateralItemProps) => {
  return (
    <div className={twMerge(`p-4 bg-tooltip w-fit rounded-[4px]`, className)}>
      <div className="flex items-center">
        <Image
          src={assetRootPath(`/images/${img}`)}
          width="16"
          height="16"
          alt={`${tokenName} logo`}
          className="w-[36px] h-[36px] md:w-[48px] md:h-[48px]"
        />
        <div className="ml-4">
          <Typography.Body2 className="text-sm md:text-base text-left font-medium">
            {tokenName}
          </Typography.Body2>
          <Typography.Body2 className="text-sm md:text-base text-left text-subheading">
            ({symbol})
          </Typography.Body2>
        </div>
      </div>
    </div>
  );
};

export default CollateralItem;
