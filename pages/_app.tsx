import "@originprotocol/origin-storybook/lib/styles.css";
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { assetRootPath } from "../utils";
import { GTM_ID, pageview } from "../utils/gtm";
import { useContracts } from "../hooks";
import "../styles/globals.css";

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

export const GlobalContext = createContext({
  defaultSeo: {},
  siteName: "",
});

export const NavigationContext = createContext({
    links: [],
});

const { provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
);

const wagmiClient = createClient({
    autoConnect: false,
    provider,
    webSocketProvider,
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

    const getLayout = Component.getLayout || ((page) => page);

  useContracts();

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
      <QueryClientProvider client={queryClient}>
          <WagmiConfig client={wagmiClient}>
              <NavigationContext.Provider
                  value={{
                      links,
                  }}
              >
                  {getLayout(<Component {...pageProps} />)}
              </NavigationContext.Provider>
          </WagmiConfig>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
