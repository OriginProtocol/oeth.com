import Section from "../../components/Section";
import Image from "next/image";
import { useState } from "react";
import { lgSize } from "../../constants";
import { useViewWidth } from "../../hooks";
import { Typography } from "@originprotocol/origin-storybook";
import { assetRootPath } from "../../utils";
import { GradientButton, SecretSauceToken } from "../../components";

interface Lsd {
  name: string;
  symbol: string;
  img: string;
  apy?: number;
}

let lsds: Lsd[] = [
  {
    name: "Origin",
    symbol: "OETH",
    img: "oeth",
  },
  {
    name: "Lido",
    symbol: "stETH",
    img: "steth",
  },
  {
    name: "Rocket Pool",
    symbol: "rETH",
    img: "reth",
  },
  {
    name: "Frax Ether",
    symbol: "sfrxETH",
    img: "sfrxeth",
  },
];

function SecretSauce() {
  const width = useViewWidth();
  const [open, setOpen] = useState(false);

  lsds = lsds.map((lsd) => ({ ...lsd, apy: 12.57 }));

  return (
    <Section className="bg-origin-bg-dgrey" innerDivClassName="max-w-[820px]">
      <Typography.H3 className="px-2 sm:px-0 pt-14 md:pt-[120px] mb-4 md:mb-20 w-full text-left md:text-center">
        Always the best pool
      </Typography.H3>

      <div className="relative h-fit px-2 sm:px-0">
        <p className="font-sansInter font-normal text-sm md:text-xl xl:text-lg inline mr-2">
          Multiple factors contribute to OETH outperforming its underlying
          strategies, but there&apos;s one big one. While 100% of the collateral
          is used to generate yield, only some of the OETH in circulation is
          receiving that yield.
        </p>
        {open && (
          <>
            <p className="font-sansInter font-normal text-sm xl:text-base leading-7 text-subheading mt-8 block">
              By default, OETH does not grow when it&apos;s held by smart
              contracts. This means that the yield that would go to these smart
              contracts becomes a bonus for all other OETH holders. OETH is
              different from most other ERC-20 tokens because your balance
              increases without receiving a transfer. Many smart contracts, such
              as AMMs, are not set up to properly account for these increases.
              So OETH is designed to allocate this yield to regular wallets
              instead of letting it go to waste. Any smart contract can opt-in
              to receive yield, but the reality is that much of OETH&apos;s
              supply is held in AMMs where liquidity providers are motivated to
              forego their yield in exchange for other incentives. <br /> <br />
            </p>
            <p className="font-sansInter font-normal text-sm xl:text-base leading-7 text-subheading inline mr-2">
              Additional sources of OETH&apos;s above-market yield include exit
              fees, smart rebalancing, and automated compounding. As the
              protocol grows, OETH holders enjoy greater economies of scale with
              the cost of funds management spread out over a larger pool of
              users.
            </p>
          </>
        )}
        <OpenButton
          onClick={() => setOpen((b) => !b)}
          imgSrc={`/images/caret.svg`}
          text={`${!open ? "Read more" : "Less"}`}
          open={open}
        />
      </div>

      {/* Need LSD APY data */}
      {/* <div className="w-full flex my-10 md:my-20">
        {lsds.map((lsd, i) => (
          <SecretSauceToken
            key={i}
            img={lsd.img}
            protocolName={lsd.name}
            symbol={lsd.symbol}
            apy={lsd.apy}
            bold={i === 0 ? true : false}
            className={`mr-[1px] flex-1 ${
              i === 0 && "rounded-l-lg gradient3"
            } ${i === lsds.length - 1 && "rounded-r-lg"}`}
          />
        ))}
      </div> */}

      <div
        className={`relative mt-10 md:mt-20 mx-auto max-w-[85vw] ${
          width < lgSize ? "w-[455px]" : "w-[820px]"
        }`}
      >
        <Image
          src={
            width < lgSize
              ? assetRootPath("/images/secret-sauce-mobile.png")
              : assetRootPath("/images/secret-sauce.png")
          }
          width="1536"
          height="1232"
          className="w-full"
          alt="Secret Sauce"
        />
      </div>

      <div className="w-full flex justify-center mt-10 d:mt-20 px-4 md:px-0">
        <GradientButton
          outerDivClassName="w-full md:w-fit mb-14 md:mb-[120px]"
          className="bg-transparent hover:bg-transparent text-center w-full"
          elementId="btn-sauce-docs"
          onClick={() =>
            window.open(
              "https://docs.ousd.com/core-concepts/elastic-supply/rebasing-and-smart-contracts",
              "_blank"
            )
          }
        >
          <Typography.H7 className="px-20 py-2 font-normal">
            Learn more
          </Typography.H7>
        </GradientButton>
      </div>
    </Section>
  );
}

interface OpenButtonProps {
  onClick: () => void;
  imgSrc: string;
  text: string;
  open: boolean;
}

const OpenButton = ({ onClick, imgSrc, text, open }: OpenButtonProps) => {
  return (
    <span
      className="text-left w-fit cursor-pointer whitespace-nowrap"
      onClick={onClick}
      id="btn-sauce-read"
    >
      <Typography.Body2 className="text-gradient2 inline font-bold">
        {text}
      </Typography.Body2>
      <Image
        src={assetRootPath(imgSrc)}
        width={12}
        height={12}
        alt=""
        className={`inline ml-2 ${open ? "rotate-180" : ""}`}
        id="btn-sauce-read-img"
      />
    </span>
  );
};

export default SecretSauce;
