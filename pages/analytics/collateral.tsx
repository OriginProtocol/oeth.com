import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Typography } from "@originprotocol/origin-storybook";
import { GetServerSideProps } from "next";
import { map } from "lodash";
import { find, orderBy } from "lodash";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import {
  ErrorBoundary,
  LayoutBox,
  Image,
  TwoColumnLayout,
} from "../../components";
import { aggregateCollateral, backingTokens } from "../../utils/analytics";
import { fetchAllocation, fetchCollateral } from "../../utils/api";
import { formatCurrency } from "../../utils/math";
import { strategyMapping } from "../../constants";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const AnalyticsCollateral = ({ strategies, collateral }) => {
  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Collateral</title>
      </Head>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <CollateralAggregate data={collateral} />
        </div>
        <div className="col-span-12">
          <CollateralPoolDistributions data={strategies} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

const CollateralAggregate = ({ data = [] }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 items-center w-full">
        {data.map(({ label, logoSrc, percentage, total }) => (
          <LayoutBox key={label} className="flex flex-shrink-0 w-full">
            <div className="flex flex-row w-full h-[150px] md:h-[150px] items-center px-6">
              <Image
                className="flex flex-shrink-0 mr-3"
                src={logoSrc}
                width={42}
                height={42}
                alt={label}
              />
              <div className="flex flex-col space-y-1">
                <Typography.Caption2 className="text-subheading text-base">
                  {label}
                </Typography.Caption2>
                <Typography.Body2 className="flex flex-row text-2xl">
                  {`Ξ${formatCurrency(total, 2)}`}
                </Typography.Body2>
                <Typography.Caption className="text-xl text-subheading">
                  {formatCurrency(percentage * 100, 2)}%
                </Typography.Caption>
              </div>
            </div>
          </LayoutBox>
        ))}
      </div>
      <div className="text-xs text-subheading pt-4">
        * All values are ETH-denominated
      </div>
    </>
  );
};

const CollateralPoolDistributions = ({ data = [] }) => {
  return (
    <div className="flex flex-col space-y-6">
      <Typography.Body3>Collateral Distribution</Typography.Body3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-1">
        {data?.map(({ name, address, holdings }) => {
          const strategyName =
            find(
              strategyMapping,
              (item) => item.address?.toLowerCase() === address?.toLowerCase(),
            )?.short_name || name;
          return (
            <LayoutBox key={address}>
              <div className="flex flex-col w-full h-full p-6">
                <Typography.Body3>{strategyName}</Typography.Body3>
                <Typography.Caption2 className="text-subheading">
                  Collateral
                </Typography.Caption2>
                <div className="flex flex-wrap w-full gap-4 py-4">
                  {map(holdings, (holdingTotal, token) =>
                    backingTokens[token] ? (
                      <div
                        key={token}
                        className="flex flex-row space-x-3 items-center h-[40px] w-[135px]"
                      >
                        <Image
                          src={backingTokens[token]?.logoSrc}
                          width={28}
                          height={28}
                          alt={token}
                        />
                        <div className="flex flex-col">
                          <Typography.Caption>{token}</Typography.Caption>
                          <Link
                            href={`https://etherscan.io/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row space-x-1 items-center w-full"
                          >
                            <Typography.Caption className="text-subheading">
                              {`${formatCurrency(holdingTotal, 2)}`}
                            </Typography.Caption>
                            <Image
                              src="/images/link.svg"
                              width={12}
                              height={12}
                              alt="External link"
                            />
                          </Link>
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            </LayoutBox>
          );
        })}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props;
}> => {
  const [allocation, { collateral }] = await Promise.all([
    fetchAllocation(),
    fetchCollateral(),
  ]);

  return {
    props: {
      strategies: orderBy(allocation?.strategies, "total", "desc"),
      collateral: orderBy(
        aggregateCollateral({ collateral, allocation }),
        "total",
        "desc",
      ),
    },
  };
};

export default AnalyticsCollateral;

AnalyticsCollateral.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);
