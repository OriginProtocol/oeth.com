import "@originprotocol/origin-storybook/lib/styles.css";
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { WagmiConfig, configureChains, mainnet, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { assetRootPath } from "../utils";
import { GTM_ID, pageview } from "../utils/gtm";
import { useContracts, usePreviousRoute } from "../hooks";
import "../styles/globals.css";
import { InjectedConnector } from "@wagmi/connectors/injected";
import { IntlProvider } from "react-intl";

const defaultQueryFn = async ({ queryKey }) => {
  return await fetch(queryKey).then((res) => res.json());
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

export const GlobalContext = createContext({
  defaultSeo: {},
  siteName: "",
});

export const NavigationContext = createContext({
  links: [],
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);
const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

const useNavigationLinks = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await fetch("/api/navigation", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            params: {
              populate: {
                links: {
                  populate: "*",
                },
              },
            },
          }),
        }).then((res) => res.json());
        setLinks(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return [{ links }];
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [{ links }] = useNavigationLinks();

  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => page);

  useContracts();
  usePreviousRoute();

  useEffect(() => {
    router.events.on("routeChangeComplete", pageview);
    return () => {
      router.events.off("routeChangeComplete", pageview);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href={assetRootPath("/images/oeth.svg")} />
      </Head>
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
      {/* @ts-ignore */}
      <IntlProvider messages={{}} locale="en" defaultLocale="en">
        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={config}>
            <NavigationContext.Provider
              value={{
                links,
              }}
            >
              {getLayout(<Component {...pageProps} />)}
            </NavigationContext.Provider>
          </WagmiConfig>
        </QueryClientProvider>
      </IntlProvider>
    </>
  );
}

export default MyApp;
