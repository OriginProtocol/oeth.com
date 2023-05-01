import "@originprotocol/origin-storybook/lib/styles.css";
import "../styles/globals.css";
import React from "react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { assetRootPath } from "../utils";

const defaultQueryFn = async ({ queryKey }) => {
  return await fetch(queryKey).then((res) => res.json());
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={assetRootPath("/images/oeth.svg")} />
      </Head>
      <QueryClientProvider client={queryClient}>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
