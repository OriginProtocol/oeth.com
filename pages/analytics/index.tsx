import Head from "next/head";
import { ErrorBoundary, TwoColumnLayout } from "../../components";
import {
  TotalSupplyChart,
  CollateralPieChart,
  APYChart,
  OETHPriceChart,
  ProtocolChart,
  WOETHChart,
} from "../../components/analytics";

const Analytics = () => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Overview</title>
      </Head>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <APYChart />
        </div>
        <div className="col-span-12">
          <TotalSupplyChart />
        </div>
        <div className="col-span-12">
          <ProtocolChart />
        </div>
        <div className="col-span-12">
          <CollateralPieChart />
        </div>
        <div className="col-span-12">
          <WOETHChart />
        </div>
        <div className="col-span-12">
          <OETHPriceChart />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Analytics;

Analytics.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
