import React, { useEffect } from "react";
import Head from "next/head";
import { ErrorBoundary, TwoColumnLayout } from "../../components";
import { formatEther } from "viem";
import { useSearchParams } from "next/navigation";

const KnownContracts = {
  "0x94b17476a93b3262d87b9a326965d1e91f9c13e7": "Curve OETH",
  "0x9858e47bcbbe6fbac040519b02d7cd4b2c470c66": "OETH Zapper",
  "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad": "Uniswap Router",
  "0x02777053d6764996e594c3e88af1d58d5363a2e6": "Keeper Registry",
  "0x39254033945aa2e4809cc2977e7087bee48bd7ab": "OETH Vault",
  "0x0000000001e4ef00d069e71d6ba041b0a16f7ea0": "Pendle",
  "0x99a58482bd75cbab83b27ec03ca68ff489b5788f": "Curve registry",
  "0xdcee70654261af21c44c093c300ed3bb97b78192": "Wrapped OETH",
  "0x9008d19f58aabd9ed0d60971565aa8510560ab41": "CoW Swap",
  "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3": "OETH",
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch",
  "0xad3b67bca8935cb510c8d18bd45f0b94f54a968f": "1inch Mev",
  "0xdef171fe48cf0115b1d80b88dc8eab59176fee57": "Paraswap",
  "0xf14bbdf064e3f67f51cd9bd646ae3716ad938fdc": "Gnosis Safe",
  "0x881d40237659c251811cec9c364ef91dc08d300c": "MetaMask Swap",
  "0x6e3fddab68bf1ebaf9dacf9f7907c7bc0951d1dc": "Gnosis Safe",
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff": "ZeroEx",
  "0x70fce97d671e81080ca3ab4cc7a59aac2e117137": "Gnosis Safe",
  "0xd1742b3c4fbb096990c8950fa635aec75b30781a": "Seawise",
  "0xf0d4c12a5768d806021f80a262b4d39d26c58b8d": "Curve router",
  "0xfa0bbb0a5815f6648241c9221027b70914dd8949": "Curve Swap",
  "0x6131b5fae19ea4f9d964eac0408e4408b66337b5": "Kyber Swap",
};

const Activity = () => {
  const [activity, setActivity] = React.useState([]);
  const [offset, setOffset] = React.useState<number | undefined>();
  const searchParams = useSearchParams();
  const l4b = searchParams.get("l4b");

  useEffect(() => {
    if (offset === undefined) {
      setOffset(0);
      return;
    }
    try {
      fetch(process.env.NEXT_PUBLIC_SUBSQUID_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query OETHActivity {
            oTokenActivities(limit: 50, offset: ${offset}, orderBy: timestamp_DESC, 
            where: { 
              ${l4b ? `callDataLast4Bytes_eq: "${l4b}",` : ""}
              chainId_eq: 1,
              otoken_eq: "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3"
            }) {
              txHash
              toSymbol
              timestamp
              sighash
              interface
              id
              fromSymbol
              exchange
              callDataLast4Bytes
              blockNumber
              amount
              address
              action
            }
          }`,
          variables: null,
          operationName: "OETHActivity",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setActivity([...activity, ...res.data.oTokenActivities]);
        });
    } catch (err) {
      console.log(`Failed to fetch daily stats: ${err}`);
    }
  }, [offset, l4b]);

  return (
    <ErrorBoundary>
      <Head>
        <title>Analytics | Activity</title>
      </Head>
      <div className="flex flex-col items-start">
        <table>
          <thead>
            <tr>
              <th className="text-left pr-4">Timestamp</th>
              <th className="text-left pr-4">Action</th>
              <th className="text-left pr-4">Amount</th>
              <th className="text-left pr-4">TX Target</th>
              <th className="text-left pr-4">Exchange</th>
              <th className="text-left pr-4">Interface</th>
              <th className="text-left pr-4">Dapp</th>
              <th className="text-left pr-4">Last 4 Bytes</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a) => (
              <tr key={a.id}>
                <td className="pr-4 font-mono text-sm">
                  <a
                    href={`https://etherscan.io/tx/${a.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {formatTimestamp(a.timestamp)}
                  </a>
                </td>
                <td className="pr-4">{a.action}</td>
                <td className="font-mono text-right pr-4 text-sm">
                  {`${Number(formatEther(a.amount || "0")).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}`}
                </td>
                <td className="pr-4">
                  <a
                    href={`https://etherscan.io/address/${a.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {KnownContracts[a.address] || a.address.substring(0, 8)}
                  </a>
                </td>
                <td className="pr-4">{a.exchange}</td>
                <td className="pr-4">{a.interface}</td>
                <td className="pr-4 text-center">
                  {a.callDataLast4Bytes === "9fed593b" ? "✅" : null}
                </td>
                <td className="pr-4 font-mono text-sm">
                  {a.callDataLast4Bytes === "00000000" ? null : (
                    <a href={`?l4b=${a.callDataLast4Bytes}`}>
                      {a.callDataLast4Bytes}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="text-center mt-4"
          onClick={() => setOffset(offset + 50)}
        >
          Load more
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default Activity;

Activity.getLayout = (page, props) => (
  <TwoColumnLayout {...props}>{page}</TwoColumnLayout>
);

function formatTimestamp(timestamp: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();

  // Formatting minute to always be two digits
  const formattedMinute = minute < 10 ? `0${minute}` : minute.toString();
  const formattedHour = hour < 10 ? `0${hour}` : hour.toString();
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${month} ${day} ${formattedHour}:${formattedMinute}:${formattedSeconds}`;
}
