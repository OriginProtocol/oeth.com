// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever middleware or an Edge route handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const env =
  process.env.APP_ENV === "staging" ? "staging" : process.env.NODE_ENV;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://8f27c5b77c7848f597bfafd25bdfcbe4@o225462.ingest.sentry.io/4505187102359552",
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  environment: env,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});