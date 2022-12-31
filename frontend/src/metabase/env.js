/* eslint-disable no-undef */
// Cypress
export const isCypressActive = !!window.Cypress;

// Origin
export const isProduction =
  location.origin.includes(process.env.PROD_URL) ||
  location.origin.includes(process.env.PRE_URL);
export const isUpgradeTest = location.origin.includes(process.env.TEST_URL);
export const isBeta = location.origin.includes(process.env.BETA_URL);
export const isAlpha = location.origin.includes(process.env.ALPHA_URL);
export const isDev = location.origin.includes(":8081");

// Bucket
export const xxxx = process.env;
export const staticBucketUrl = process.env.STATIC_BUCKET_URL || "https://statichk.footprint.network";
export const staticBucketUrlDefault = process.env.STATIC_BUCKET_URL || "https://statichk.footprint.network";
export const staticBucketUrlHk = process.env.STATIC_BUCKET_HK_URL || "https://statichk.footprint.network";
export const staticBucketKeyId = process.env.STATIC_BUCKET_KEY_ID || "xx";
export const staticBucketKeySecret = process.env.STATIC_BUCKET_KEY_SECRET || "yy";

// Hasura
export const hasuraUrl = isProduction
  ? process.env.HASURA_URL
  : process.env.HASURA_DEV_URL;

// Gaia DAO
export const daoUrl = isProduction
  ? process.env.GAIA_DAO_URL
  : process.env.GAIA_DAO_DEV_URL;

// Jupyter
export const jupyterServerUrl = process.env.JUPYTER_SERVER_URL;
export const jupyterToken = process.env.JUPYTER_TOKEN;

// Slack
export const slackUrl = process.env.SLACK_URL;

// ARMS
export const armsPid = "1erasm1qtfy@05d779f3f8375cf";
