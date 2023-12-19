import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface HeroDataProps {
  title: string;
  value: string;
  subtext: string;
  href: string;
  className?: string;
}

const HeroData = ({
  title,
  value,
  subtext,
  className,
  href,
}: HeroDataProps) => {
  return (
    <Link
      href={href}
      target="_parent"
      rel="noopener noreferrer"
      prefetch={false}
      className={twMerge(
        "py-4 md:py-8 text-center leading-[28px] md:leading-[32px]",
        className,
      )}
    >
      <Typography.Body>{title}</Typography.Body>
      <Typography.H5 className="font-bold text-2xl md:text-[40px] leading-[32px] md:leading-[48px]">
        {value}
      </Typography.H5>
      <Typography.Body2 className="mt-1 text-subheading text-xs md:text-sm">
        {subtext}
      </Typography.Body2>
    </Link>
  );
};

export default HeroData;
