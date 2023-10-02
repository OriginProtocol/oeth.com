import { createContext, useContext, useState } from "react";

import {
  endOfToday,
  intlFormat,
  intlFormatDistance,
  startOfDay,
  subDays,
} from "date-fns";
import { useIntl } from "react-intl";
import { formatEther } from "viem";

import * as colors from "./colors";
import { useFinancialStatementQuery } from "./FinancialStatement.generated";
import { useChainlinkEthUsd } from "../../utils/useChainlinkEthUsd";
import { useElementSize } from "usehooks-ts";
import cn from "classnames";
import Image from "next/image";

const links = {
  Assets: {
    Vault: {
      WETH: "https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?a=0x39254033945aa2e4809cc2977e7087bee48bd7ab",
      stETH:
        "https://etherscan.io/token/0xae7ab96520de3a18e5e111b5eaab095312d7fe84?a=0x39254033945aa2e4809cc2977e7087bee48bd7ab",
      rETH: "https://etherscan.io/token/0xae78736cd615f374d3085123a210448e74fc6393?a=0x39254033945aa2e4809cc2977e7087bee48bd7ab",
      frxETH:
        "https://etherscan.io/token/0x5e8422345238f34275888049021821e8e08caa1f?a=0x39254033945aa2e4809cc2977e7087bee48bd7ab",
    },
    Curve: {
      ETH: "https://etherscan.io/address/0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
      OETH: "https://etherscan.io/token/0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3?a=0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
    },
    "Frax Staking": {
      frxETH:
        "https://etherscan.io/token/0xac3e018457b222d93114458476f3e3416abbe38f?a=0x3ff8654d633d4ea0fae24c52aec73b4a20d0d0e5",
    },
    "Morpho Aave": {
      WETH: "https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?a=0xc1fc9e5ec3058921ea5025d703cbe31764756319",
    },
    Dripper: {
      WETH: "https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?a=0xc0f42f73b8f01849a2dd99753524d4ba14317eb3",
    },
  },
  Liabilities: {
    "Token Supply": {
      OETH: "https://etherscan.io/address/0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3#readProxyContract#F19",
    },
  },
};

const calculateChange = (from: number, to: number) => {
  if (from === 0 && to === 0) return 0;
  const change = -(1 - to / from);
  const mod = to < 0 ? -1 : 1;
  const result =
    (Math[change > 0 ? "floor" : "ceil"](change * 10000) / 100) * mod;
  if (result.toFixed(2) === "0.00") return 0; // Weed out tiny rounding issues
  return result;
};

const getTotals = (data: Record<string, Record<string, number[]>>) => {
  return Object.values(data).reduce((totals, section) => {
    for (const asset of Object.values(section)) {
      for (let i = 0; i < asset.length; i++) {
        totals[i] = (totals[i] ?? 0) + asset[i];
      }
    }
    return totals;
  }, [] as number[]);
};

export const LiveFinancialStatement = () => {
  const todayEnd = endOfToday();
  const sevenDaysAgo = startOfDay(subDays(todayEnd, 7));

  const { isLoading: fsIsLoading, data: fs } = useFinancialStatementQuery({
    compareDate: todayEnd.toISOString(),
  });
  const { isLoading: fsCIsLoading, data: fsC } = useFinancialStatementQuery({
    compareDate: sevenDaysAgo.toISOString(),
  });
  const { isLoading: ethPriceIsLoading, data: ethPrice } = useChainlinkEthUsd();

  if (fsIsLoading || !fs) return null;
  if (fsCIsLoading || !fsC) return null;
  if (ethPriceIsLoading || !ethPrice) return null;

  const c = (n?: string) => Number(formatEther(BigInt(n ?? 0)));

  const blockNumber = Math.max(
    fs.vaults[0]?.blockNumber,
    fs.curveLps[0]?.blockNumber,
    fs.morphoAaves[0]?.blockNumber,
    fs.drippers[0]?.blockNumber,
    fs.oeths[0]?.blockNumber,
    fs.fraxStakings[0]?.blockNumber
  );
  const timestamp = Math.max(
    Date.parse(fs.vaults[0]?.timestamp),
    Date.parse(fs.curveLps[0]?.timestamp),
    Date.parse(fs.morphoAaves[0]?.timestamp),
    Date.parse(fs.drippers[0]?.timestamp),
    Date.parse(fs.oeths[0]?.timestamp),
    Date.parse(fs.fraxStakings[0]?.timestamp)
  );

  return (
    <FinancialStatement
      ethPrice={ethPrice?.floatUsd}
      lastUpdated={{
        blockNumber,
        timestamp,
      }}
      columns={[
        intlFormatDistance(sevenDaysAgo, new Date()),
        intlFormat(todayEnd),
      ]}
      data={{
        assets: {
          Vault: {
            WETH: [fsC.vaults[0]?.weth, fs.vaults[0]?.weth].map(c),
            stETH: [fsC.vaults[0]?.stETH, fs.vaults[0]?.stETH].map(c),
            rETH: [fsC.vaults[0]?.rETH, fs.vaults[0]?.rETH].map(c),
            frxETH: [fsC.vaults[0]?.frxETH, fs.vaults[0]?.frxETH].map(c),
          },
          Curve: {
            ETH: [fsC.curveLps[0]?.ethOwned, fs.curveLps[0]?.ethOwned].map(c),
            OETH: [fsC.curveLps[0]?.oethOwned, fs.curveLps[0]?.oethOwned].map(
              c
            ),
          },
          "Frax Staking": {
            frxETH: [
              fsC.fraxStakings[0]?.frxETH,
              fs.fraxStakings[0]?.frxETH,
            ].map(c),
          },
          "Morpho Aave": {
            WETH: [fsC.morphoAaves[0]?.weth, fs.morphoAaves[0]?.weth].map(c),
          },
          Dripper: {
            WETH: [fsC.drippers[0]?.weth, fs.drippers[0]?.weth].map(c),
          },
        },
        liabilities: {
          "Token Supply": {
            OETH: [fsC.oeths[0]?.totalSupply, fs.oeths[0]?.totalSupply].map(c),
          },
        },
      }}
    />
  );
};

const FinancialStatementContext = createContext({
  ethPrice: undefined as number | undefined,
  showUsdPrice: false,
  isNarrow: false,
});

export const FinancialStatement = (props: {
  ethPrice?: number;
  lastUpdated: {
    blockNumber: number;
    timestamp: number;
  };
  columns: string[];
  data: Record<
    "assets" | "liabilities",
    Record<string, Record<string, number[]>>
  >;
}) => {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const intl = useIntl();
  const assetTotals = getTotals(props.data["assets"]);
  const liabilityTotals = getTotals(props.data["liabilities"]);
  const [showUsdPrice, setShowUsdPrice] = useState(false);
  const isNarrow = width < 650;

  return (
    <FinancialStatementContext.Provider
      value={{
        ethPrice: props.ethPrice,
        showUsdPrice,
        isNarrow,
      }}
    >
      <div
        className={"flex flex-col gap-4 text-[#B5BECA] text-xs sm:text-sm"}
        style={{ fontFamily: "Inter" }}
        ref={ref}
      >
        <div className={"flex justify-end"}>
          <div
            className={
              "flex gap-1 sm:gap-2 md:gap-2 h-6 sm:h-8 md:h-10 rounded-full overflow-hidden bg-[#1E1F25]"
            }
          >
            <button
              className={cn(
                "rounded-full p-px",
                !showUsdPrice ? "bg-gradient4" : "hover:bg-gray-300/20"
              )}
              onClick={() => setShowUsdPrice(false)}
            >
              <div
                className={cn(
                  "px-4 py-2 rounded-full w-full h-full flex items-center justify-center",
                  !showUsdPrice ? "text-[#FAFBFB]" : "text-[#B5BECA]",
                  "bg-[#1E1F25DD]"
                )}
              >
                ETH
              </div>
            </button>
            <button
              className={cn(
                "rounded-full p-px",
                showUsdPrice ? "bg-gradient4" : "hover:bg-gray-300/20"
              )}
              onClick={() => setShowUsdPrice(true)}
            >
              <div
                className={cn(
                  "px-4 py-2 rounded-full w-full h-full flex items-center justify-center",
                  showUsdPrice ? "text-[#FAFBFB]" : "text-[#B5BECA]",
                  "bg-[#1E1F25DD]"
                )}
              >
                USD
              </div>
            </button>
          </div>
        </div>
        <Header columns={props.columns} />
        <Table
          title={"Assets"}
          data={props.data["assets"]}
          totals={assetTotals}
        />
        <Table
          title={"Liabilities"}
          data={props.data["liabilities"]}
          totals={liabilityTotals}
        />

        <div
          className={"sm:rounded-sm md:rounded-md overflow-hidden bg-[#1E1F25]"}
        >
          <Total
            title={"PROTOCOL NET VALUE"}
            totals={assetTotals.map(
              (val, index) => val - liabilityTotals[index]
            )}
          />
        </div>
        <div className={"mt-2 sm:mt-4 md:mt-6 text-[#FAFBFB]"}>
          <p className={"text-sm sm:text-base"}>
            {`Last updated ${intlFormat(props.lastUpdated.timestamp)}, `}
            {`block #${props.lastUpdated.blockNumber}`}
          </p>
          <p className={"text-sm sm:text-base"}>
            {props.ethPrice &&
              `Using ETH price of $${intl.formatNumber(props.ethPrice, {
                maximumFractionDigits: 2,
              })} from Chainlink`}
          </p>
        </div>
      </div>
    </FinancialStatementContext.Provider>
  );
};

const Header = (props: { columns: string[] }) => {
  const { isNarrow } = useContext(FinancialStatementContext);
  const columnWeight = props.columns.length + 2;
  return (
    <div className={"sm:rounded-sm md:rounded overflow-hidden bg-[#1E1F25]"}>
      <div
        className={cn(
          "flex items-center justify-between text-[#B5BECA] bg-[#23242A] text-xs sm:text-sm md:text-base",
          "px-2 sm:px-4 md:px-8",
          "py-2 sm:py-6 md:py-8"
        )}
      >
        <div style={{ width: `${(100 / columnWeight) * 1.5}%` }} />
        {props.columns.map((column) => (
          <div
            key={column}
            className={"ml-4"}
            style={{
              width: `${100 / columnWeight}%`,
              maxWidth: 250,
              textAlign: "right",
            }}
          >
            {column}
          </div>
        ))}
        <div
          style={{
            width: `${100 / columnWeight}%`,
            maxWidth: 250,
            textAlign: "right",
          }}
        >
          {isNarrow ? "Diff" : "Difference"}
        </div>
      </div>
    </div>
  );
};

const Table = (props: {
  title: string;
  data: Record<string, Record<string, number[]>>;
  totals: number[];
}) => {
  return (
    <div
      key={props.title}
      className={"sm:rounded-sm md:rounded-md overflow-hidden bg-[#1E1F25]"}
    >
      <div className={"flex flex-col"}>
        {/* Header */}
        <div
          className={cn(
            "py-3 sm:py-4 md:py-8",
            "px-2 sm:px-4 md:px-8",
            "text-[#B5BECA]",
            "text-sm sm:text-base",
            "border-b border-b-[#141519]"
          )}
        >
          {props.title}
        </div>

        {/* Body */}
        <div className={"flex flex-col"}>
          {Object.entries(props.data).map(([title, data]) => (
            <Section
              key={title}
              table={props.title}
              title={title}
              data={data}
            />
          ))}
        </div>

        {/* Total */}
        <Total title={`TOTAL ${props.title}`} totals={props.totals} />
      </div>
    </div>
  );
};

const Total = (props: { title: string; totals: number[] }) => {
  const columnWeight = props.totals.length + 2;
  return (
    <div
      className={
        "flex justify-between items-center p-2 sm:p-4 md:p-8 text-[#FAFBFB] bg-[#23242A]"
      }
    >
      <div style={{ width: `${(100 / columnWeight) * 1.5}%` }}>
        {props.title.toUpperCase()}
      </div>
      {props.totals.map((value, index) => (
        <DataColumn key={index} columnWeight={columnWeight} value={value} />
      ))}
      <ChangeColumn columnWeight={columnWeight} values={props.totals} />
    </div>
  );
};

const Section = (props: {
  table: string;
  title: string;
  data: Record<string, number[]>;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col",
        "border-b border-b-[#141519]",
        "gap-2 sm:gap-4 md:gap-8",
        "px-2 sm:px-4 md:px-8",
        "pt-2 sm:pt-4 md:pt-8"
      )}
    >
      <div className={"flex text-[#FAFBFB]"}>{props.title}</div>
      <div
        className={cn(
          "flex flex-col",
          "gap-2 sm:gap-4 md:gap-8",
          "pb-2 sm:pb-4 md:pb-8"
        )}
      >
        {Object.entries(props.data).map(([title, data]) => (
          <Asset
            key={title}
            table={props.table}
            section={props.title}
            title={title}
            data={data}
          />
        ))}
      </div>
    </div>
  );
};

const Asset = (props: {
  table: string;
  section: string;
  title: string;
  data: number[];
}) => {
  const columnWeight = props.data.length + 2;
  return (
    <div className={"flex flex-col"} key={props.title}>
      <div className={"flex justify-between"}>
        <div
          className={"pl-4 -mr-4 text-[#B5BECA]"}
          style={{ width: `${(100 / columnWeight) * 1.5}%` }}
        >
          {props.title}
        </div>
        {props.data.map((value, index) => (
          <DataColumn
            key={index}
            link={
              index === props.data.length - 1 &&
              links[props.table]?.[props.section]?.[props.title]
            }
            columnWeight={columnWeight}
            value={value}
          />
        ))}
        <ChangeColumn columnWeight={columnWeight} values={props.data} />
      </div>
    </div>
  );
};

export const DataColumn = ({
  value,
  columnWeight,
  link,
}: {
  value: number;
  columnWeight: number;
  link?: string;
}) => {
  const { isNarrow } = useContext(FinancialStatementContext);
  const intl = useIntl();
  const { showUsdPrice, ethPrice } = useContext(FinancialStatementContext);
  const content = (
    <>
      <span className={"pr-[1px] sm:pr-[1.5px] md:pr-[2px] text-[#B5BECA]"}>
        {showUsdPrice && ethPrice ? "$" : "Ξ"}
      </span>
      {intl.formatNumber(showUsdPrice && ethPrice ? value * ethPrice : value, {
        notation: isNarrow ? "compact" : "standard",
        maximumFractionDigits: isNarrow ? 1 : 2,
      })}
    </>
  );
  return (
    <div
      className={"ml-0.5"}
      style={{
        width: `${100 / columnWeight}%`,
        maxWidth: 250,
        textAlign: "right",
        color: "#FAFBFB",
      }}
    >
      {link ? (
        <a
          href={link}
          className="hover:font-bold flex items-center justify-end"
          target="_blank"
        >
          {content}
          <Image
            className="ml-2"
            src="/images/ext-link-white.svg"
            height={8}
            width={8}
            alt="External link icon"
          />
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export const ChangeColumn = ({
  values,
  columnWeight,
}: {
  values: number[];
  columnWeight: number;
}) => {
  const { isNarrow } = useContext(FinancialStatementContext);
  const intl = useIntl();
  const change = calculateChange(
    values[values.length - 2],
    values[values.length - 1]
  );
  return (
    <div
      style={{
        width: `${100 / columnWeight}%`,
        maxWidth: 250,
        textAlign: "right",
        color:
          change > 0
            ? colors.positive
            : change < 0
            ? colors.negative
            : "#B5BECA",
      }}
    >
      {isFinite(change) && change > 0 && "+"}
      {!isNaN(change) &&
        isFinite(change) &&
        `${intl.formatNumber(change, {
          notation: isNarrow ? "compact" : "standard",
          maximumFractionDigits: isNarrow ? 1 : 2,
        })}%`}
    </div>
  );
};
