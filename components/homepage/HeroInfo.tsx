import { Typography } from "@originprotocol/origin-storybook";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface HeroInfoProps {
  title: string;
  subtitle: string;
  className?: string;
}

const HeroInfo = ({
  title,
  subtitle,
  className,
  children,
}: PropsWithChildren<HeroInfoProps>) => {
  return (
    <div className={twMerge("p-6 md:p-10 text-center", className)}>
      <Typography.H7 className="text-xl md:text-2xl text-white">
        {title}
      </Typography.H7>
      <Typography.Body3 className="text-xs md:text-sm mt-4 text-subheading leading-[20px] md:leading-[23px]">
        {subtitle}
      </Typography.Body3>
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default HeroInfo;
