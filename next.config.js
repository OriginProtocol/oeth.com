const locales = require("./locales");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales,
    defaultLocale: "en",
  },
  images: {
    loader: "default",
    domains: [
      "localhost",
      "0.0.0.0",
      "cmsmediaproduction.s3.amazonaws.com",
      "cmsmediastaging.s3.amazonaws.com",
      "avatars.githubusercontent.com",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: `${process.env.STRAPI_API_URL}/api/oeth/sitemap`,
        },
        {
          source: "/robots.txt",
          destination:
            process.env.APP_ENV === "prod"
              ? "/robots.prod.txt"
              : "/robots.staging.txt",
        },
      ],
    };
  },
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "origin-protocol",
    project: "oeth",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
