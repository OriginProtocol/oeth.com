import { Typography } from "@originprotocol/origin-storybook";
import React from "react";
import { Section } from "../../components";

const Heading = () => {
  return (
    <Section className="mt-8 md:mt-20 px-8">
      <Typography.H2 className="font-medium text-origin-white">
        OETH
      </Typography.H2>
      <Typography.H2 className="text-gradient2 font-black">
        Proof of yield
      </Typography.H2>
      <Typography.Body className="mt-4 md:mt-10 xl:max-w-[75%] text-table-title text-sm md:text-base">
        {`Do you know where your DeFi yield comes from? OETH's yield is transparent, real and 100% verifiable on-chain. See the evidence of OETH's consistent performance over the past 30 days.`}
      </Typography.Body>
    </Section>
  );
};

export default Heading;
