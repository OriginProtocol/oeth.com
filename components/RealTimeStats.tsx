import { useFeeData } from "wagmi";
import Image from "next/image";
import { Typography } from "@originprotocol/origin-storybook";

const RealTimeStats = () => {
  const { data, isError, isLoading } = useFeeData();

  const gwei =
    !isLoading && !isError
      ? Number(data?.formatted?.gasPrice || "0").toFixed(2)
      : 0;

  return (
    <div className="flex flex-row md:justify-end w-full h-[44px] space-x-2 ">
      <div className="flex items-center max-w-[120px] w-full h-full rounded-md px-2 bg-origin-bg-grey text-origin-white">
        <div className="flex flex-row items-center justify-center space-x-2 w-full h-full">
          <Image
            src="/images/gas.svg"
            height={18}
            width={18}
            alt="Gas station icon"
          />
          <Typography.Caption className="text-subheading">
            {gwei}
          </Typography.Caption>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStats;
