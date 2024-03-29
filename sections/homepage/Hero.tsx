import Image from "next/image";
import { useState, MouseEvent, useEffect } from "react";
import { Typography } from "@originprotocol/origin-storybook";
import Link from "next/link";
import { GradientButton, HeroInfo, Section, HeroData } from "../../components";
import {
  assetRootPath,
  commifyToDecimalPlaces,
  formatCurrency,
  postEmail,
} from "../../utils";
import { mdSize } from "../../constants";
import { useViewWidth } from "../../hooks";
import { sanitize } from "dompurify";
import { twMerge } from "tailwind-merge";

interface HeroProps {
  apy: number;
  apyDays: number;
  tvl: string;
  tvlUsd: string;
  sectionOverrideCss?: string;
  revenueAllTime: number;
}

enum NotifStatuses {
  DEFAULT = "(no spam)",
  SUCCESS = "Success!",
  INVALID_EMAIL = "Not a valid email format",
  SERVER_ERROR = "Something went wrong. Please try again",
}

const Hero = (props: HeroProps) => {
  const { apy, tvl, tvlUsd, sectionOverrideCss, revenueAllTime } = props;
  const width = useViewWidth();
  const [emailInput, setEmailInput] = useState<string>("");
  const [notifText, setNotifText] = useState<string>(NotifStatuses.DEFAULT);

  const notify = async (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const { success, message } = await postEmail(sanitize(emailInput));

      if (success) {
        setNotifText(NotifStatuses.SUCCESS);
      } else {
        console.log(message);
        setNotifText(NotifStatuses.INVALID_EMAIL);
      }
    } catch (err) {
      console.error(err);
      setNotifText(NotifStatuses.SERVER_ERROR);
    }

    setEmailInput("");
  };

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
          className="font-sansSailec text-[56px] md:text-[64px] leading-[64px] md:leading-[72px] text-center"
          style={{ fontWeight: 700 }}
        >
          Stack ETH faster
        </Typography.H2>
        <Typography.Body
          as="h1"
          className="mt-6 leading-[28px] text-origin-white"
        >
          Ethereum liquid staking made simple
        </Typography.Body>

        {process.env.NEXT_PUBLIC_LINK_DAPP ? (
          <>
            <GradientButton
              onClick={() =>
                window.open(
                  process.env.NEXT_PUBLIC_DAPP_URL,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              outerDivClassName="mt-10 md:mt-20 w-full md:w-fit md:mx-auto  hover:bg-transparent hover:opacity-90"
              className="w-full bg-transparent py-[14px] md:py-5 md:px-20 lg:px-20 hover:bg-transparent text-base md:text-2xl"
              elementId="btn-hero-buy"
            >
              Get OETH
            </GradientButton>
            <div className="flex flex-wrap mt-10 md:mt-20 max-w-[calc(100vw-32px)] w-[638px] border border-[#ffffff1a] bg-origin-bg-blackt rounded-lg">
              <HeroData
                href="/proof-of-yield"
                className="border-r border-[#ffffff1a] w-1/2"
                title="APY"
                value={`${formatCurrency(apy * 100, 2)}%`}
                subtext={`Trailing ${props.apyDays}-day`}
              />
              <HeroData
                href="/analytics"
                className="w-1/2"
                title="TVL"
                value={`Ξ ${parseFloat(tvl).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
                subtext={`$${parseFloat(tvlUsd).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
              />
              <Link
                href="/analytics"
                target="_parent"
                rel="noopener noreferrer"
                prefetch={false}
                className={twMerge(
                  "py-4 md:py-8 text-center leading-[28px] md:leading-[32px]",
                  "w-full border-t border-[#ffffff1a]",
                )}
              >
                <Typography.Body2>Total yield generated:</Typography.Body2>
                <Typography.H5 className="font-bold text-xl md:text-[24px]">
                  {`Ξ ${revenueAllTime.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`}
                </Typography.H5>
              </Link>
            </div>
          </>
        ) : (
          <>
            <Typography.Body className="mt-6 md:mt-20">
              Be the first to know when OETH launches
            </Typography.Body>
            <form className="w-full md:w-auto">
              <div
                className={
                  "relative bg-origin-bg-grey md:bg-gradient2 rounded-[100px] p-[1px] h-fit mt-6  lg:mt-8 w-full md:w-fit"
                }
              >
                <div className="relative bg-transparent md:bg-origin-bg-black rounded-[100px] px-2 py-3 md:py-2 text-origin-white flex items-center justify-start border-2 border-origin-bg-dgrey md:border-none">
                  <input
                    className="bg-transparent outline-none px-4 md:px-6 lg:px-10"
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setNotifText(NotifStatuses.DEFAULT);
                      setEmailInput(e.target.value);
                    }}
                    value={emailInput}
                  />
                  {width >= mdSize && <NotifyButton onClick={notify} />}
                </div>
              </div>
              {width < mdSize && <NotifyButton onClick={notify} />}
            </form>
            <Typography.Body3
              className={`text-sm mt-4 ${
                notifText === NotifStatuses.DEFAULT
                  ? "text-table-title"
                  : notifText === NotifStatuses.SUCCESS
                  ? "text-green-400"
                  : "text-red-500"
              }`}
            >
              {notifText}
            </Typography.Body3>{" "}
          </>
        )}

        {/* "Trusted yield sources" and "Fully collateralized" */}
        <div className="flex flex-col md:flex-row mb-6 mt-6 md:mt-20 z-10">
          <HeroInfo
            title="Trusted yield sources"
            subtitle="Only battle-tested, blue-chip protocols are used to generate OETH's market-leading, risk-adjusted yield."
            className="w-full md:w-1/2 bg-origin-bg-dgrey rounded-lg mr-0 md:mr-7 mb-6 md:mb-0 balance"
          >
            <Image
              src={assetRootPath("/images/yield-sources.png")}
              width="700"
              height="100"
              alt="lido frax curve rocketpool convex"
            />
          </HeroInfo>

          <HeroInfo
            title="Fully collateralized"
            subtitle="OETH is always redeemable for a basket of ETH and the most trusted liquid staking tokens."
            className="w-full md:w-1/2 bg-origin-bg-dgrey rounded-lg balance"
          >
            <Image
              src={assetRootPath("/images/fully-collateralized.svg")}
              width="700"
              height="700"
              alt="ETH rETH frxETH stETH"
            />
          </HeroInfo>
        </div>
      </Section>
    </>
  );
};

const NotifyButton = ({ onClick }: { onClick?: (...args: any[]) => void }) => {
  return (
    <GradientButton
      onClick={onClick}
      outerDivClassName="w-full md:w-auto mt-4 md:mt-0"
      className="bg-transparent hover:bg-transparent w-full md:w-auto lg:px-20 py-3 lg:py-5"
      elementId="btn-hero-notify"
    >
      <Typography.H7 className="font-normal text-center">
        Notify me
      </Typography.H7>
    </GradientButton>
  );
};

export default Hero;
