import React from "react";
import Image from "next/image";
import { Typography } from "@originprotocol/origin-storybook";
import { GradientButton, HeroInfo, Section } from "../../components";
import { assetRootPath } from "../../utils";
import { lgSize, mdSize } from "../../constants";
import { useViewWidth } from "../../hooks";
import { commifyToDecimalPlaces } from "../../utils";
import { twMerge } from "tailwind-merge";
import { Dictionary } from "lodash";

interface HeroProps {
  sectionOverrideCss?: string;
}

const Hero = ({ sectionOverrideCss }: HeroProps) => {
  const width = useViewWidth();

  return (
    <>
      <Section
        className={twMerge("z-10 relative", sectionOverrideCss)}
        innerDivClassName="flex flex-col items-center justify-between max-w-[1432px]"
      >
        {/* Grey background on bottom half */}
        <div className="absolute h-[200px] bg-origin-bg-grey bottom-0 w-[100vw] left-0">
          <Image
            src={assetRootPath("/images/splines31.png")}
            width={500}
            height={500}
            alt="splines31"
            className="absolute top-0 right-0 -translate-y-2/3 z-[-2]"
          />
        </div>

        <Typography.H2
          as="div"
          className="font-sansSailec text-[40px] md:text-[64px] leading-[40px] md:leading-[72px] text-center"
          style={{ fontWeight: 500 }}
        >
          Stack
          {width < lgSize && <br />}
          <span className="text-gradient2 font-black py-1 mx-4">more ETH</span>
          {width < lgSize && <br />}
          faster
        </Typography.H2>
        <Typography.Body
          as="h1"
          className="mt-6 leading-[28px] text-subheading"
        >
          Ethereum Liquid Staking made simple.
        </Typography.Body>

        <Typography.Body className="mt-6 md:mt-20">
          Be the first to know when OETH launches
        </Typography.Body>
        <div
          className={
            "relative bg-origin-bg-grey md:bg-gradient2 rounded-[100px] p-[1px] h-fit mt-6  lg:mt-8 w-full md:w-fit"
          }
        >
          <div className="relative bg-transparent md:bg-origin-bg-black rounded-[100px] px-2 py-3 md:py-2 text-origin-white flex items-center justify-start">
            <input
              className="bg-transparent outline-none px-4 md:px-6 lg:px-10"
              placeholder="Enter your email"
            ></input>
            {width >= mdSize && <NotifyButton />}
          </div>
        </div>
        {width < mdSize && <NotifyButton />}

        {/* "Trusted yield sources" and "Fully collateralized" */}
        <div className="flex flex-col md:flex-row mb-6 mt-6 md:mt-20 z-10">
          <HeroInfo
            title="Trusted yield sources"
            subtitle="(Placeholder) Blue-chips combined with boosted APYs and trading fees deliver a higher yield than just holding LSDs. "
            className="w-full md:w-1/2 bg-origin-bg-dgrey rounded-lg mr-0 md:mr-7 mb-6 md:mb-0"
          >
            <Image
              src={assetRootPath("/images/yield-sources.svg")}
              width="700"
              height="100"
              alt="lido curve frax balancer"
            />
          </HeroInfo>

          <HeroInfo
            title="Fully collateralized"
            subtitle="(Placeholder) Blue-chips combined with boosted APYs and trading fees deliver a higher yield than just holding LSDs. "
            className="w-full md:w-1/2 bg-origin-bg-dgrey rounded-lg"
          >
            <Image
              src={assetRootPath("/images/fully-collateralized.svg")}
              width="700"
              height="700"
              alt="rETH ETH stETH sfrxETH"
            />
          </HeroInfo>
        </div>
      </Section>
    </>
  );
};

const NotifyButton = () => {
  return (
    <GradientButton
      onClick={() =>
        window.open(
          `${process.env.NEXT_PUBLIC_DAPP_URL}`,
          "_blank",
          "noopener noreferrer"
        )
      }
      outerDivClassName="w-full md:w-auto mt-4 md:mt-0"
      className="bg-transparent hover:bg-transparent w-full md:w-auto lg:px-20 py-3 lg:py-5"
    >
      <Typography.H7 className="font-normal text-center">
        Notify me
      </Typography.H7>
    </GradientButton>
  );
};

export default Hero;
