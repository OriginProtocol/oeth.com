import React from "react";
import Head from "next/head";
import { Typography } from "@originprotocol/origin-storybook";
import { ErrorBoundary, TwoColumnLayout } from "../../components";
import { DripperBasicStats } from "../../sections";
import { GetServerSideProps } from "next";
import { fetchDripperData } from "../../utils";

const AnalyticsDripper = ({ dripper }) => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Dripper</title>
      </Head>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <Typography.Caption className="text-subheading max-w-6xl">
            When yield is generated, it does not immediately get distributed to
            users’ wallets. It first goes through the Dripper, which releases
            the yield steadily over time. Raw yield is often generated at
            irregular intervals and in unpredictable amounts. The Dripper
            streams this yield gradually for a smoother and more predictable
            APY.
          </Typography.Caption>
        </div>
        <div className="col-span-12">
          <DripperBasicStats
            className="!p-0 !m-0 !w-full"
            data={{
              fundsHeld: dripper?.tokenBalance,
              available: dripper?.available,
              ratePerDay: dripper?.ratePerDay,
              ratePerHour: dripper?.ratePerHour,
              ratePerMinute: dripper?.ratePerMinute,
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props;
}> => {
  const dripper = await fetchDripperData();
  return {
    props: {
      dripper,
    },
  };
};

export default AnalyticsDripper;

AnalyticsDripper.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
