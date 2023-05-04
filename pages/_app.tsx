import "@originprotocol/origin-storybook/lib/styles.css";
import "../styles/globals.css";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { assetRootPath } from "../utils";
import { GTM_ID, pageview } from "../utils/gtm";

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
  const router = useRouter();
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
      {/* @ts-ignore */}
      <Component {...pageProps} />
    </QueryClientProvider>
  </>
  );
}

export default MyApp;
