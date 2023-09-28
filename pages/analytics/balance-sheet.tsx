import Head from "next/head";
import { ErrorBoundary, TwoColumnLayout } from "../../components";
import React from "react";
import { LiveFinancialStatement } from "../../components/financial-statement";

const BalanceSheet = () => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Financial Statement</title>
      </Head>
      <div className="flex-0 flex flex-col w-full h-screen">
        <Content />
      </div>
    </ErrorBoundary>
  );
};

export default BalanceSheet;

BalanceSheet.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);

const Content = () => {
  return (
    <div className="pb-8">
      <LiveFinancialStatement />
    </div>
  );
};
