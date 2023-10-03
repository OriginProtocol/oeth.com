import Head from "next/head";
import { ErrorBoundary, TwoColumnLayout } from "../../components";
import React from "react";
import { LiveFinancialStatement } from "../../components/financial-statement";

const BalanceSheet = () => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Balance Sheet</title>
      </Head>
      <LiveFinancialStatement />
    </ErrorBoundary>
  );
};

export default BalanceSheet;

BalanceSheet.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
