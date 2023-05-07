import Image from "next/image";
import { GradientButton, GrowingWallet, Section } from "../../components";
import { useViewWidth } from "../../hooks";
import { lgSize, smSize } from "../../constants";
import { assetRootPath } from "../../utils";
import { Typography } from "@originprotocol/origin-storybook";
import { twMerge } from "tailwind-merge";

const Wallet = () => {
  const width = useViewWidth();

  const bullets = [
    "Auto-compounding in your wallet",
    "Protocol-guaranteed liquidity",
    "Self-custodial, always liquid",
    "No staking or lock-ups",
  ];

  return (
    <Section className="bg-origin-bg-grey">
      {/* Wallet container */}
      <div className="bg-origin-bg-dgreyt w-full flex flex-col lg:flex-row rounded-lg lg:pr-16 relative">
        {width < lgSize && <OethList className="px-6 pt-6" bullets={bullets} />}
        <div
          className="z-10 w-fit h-fit mt-10 lg:mt-[72px] lg:mr-14 2xl:mr-[100px] 
         mx-auto sm:ml-6 lg:ml-16 px-2 pt-2 rounded-t-xl bg-gradient-to-r from-gradient1-fromt to-gradient1-tot"
        >
          <GrowingWallet className="pt-2" />
        </div>
        {width < smSize && (
          <Image
            src={assetRootPath("/images/splines35.png")}
            width={500}
            height={500}
            alt="splines35"
            className="absolute bottom-0 rounded-b-lg"
          />
        )}
        {width >= lgSize && <OethList className="mt-20" bullets={bullets} />}
      </div>
    </Section>
  );
};

const OethList = ({
  bullets,
  className,
}: {
  bullets: string[];
  className?: string;
}) => {
  return (
    <div className={twMerge("lg:mb-20", className)}>
      <Typography.H5>More yields. Less hassle.</Typography.H5>
      <ul className="home-ul mt-8 ">
        {bullets.map((e, i) => (
          <li className="mt-4" key={i}>
            <Typography.Body className="text-sm">{e}</Typography.Body>
          </li>
        ))}
      </ul>
      <GradientButton
        onClick={() => window.open(process.env.NEXT_PUBLIC_DOCS_URL, "_blank")}
        outerDivClassName="mt-10 w-full md:w-fit"
        className="bg-origin-bg-dgrey w-full md:w-fit"
        elementId="btn-wallet-docs"
      >
        Learn More
      </GradientButton>
    </div>
  );
};

export default Wallet;
