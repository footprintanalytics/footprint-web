/* eslint-env node */
/* eslint-disable import/no-commonjs */
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const WebpackAliyunOssPlugin = require("webpack-aliyun-oss");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

const fs = require("fs");
const os = require("os");

const ASSETS_PATH = __dirname + "/resources/frontend_client/app/assets";
const FONTS_PATH = __dirname + "/resources/frontend_client/app/fonts";
const SRC_PATH = __dirname + "/frontend/src/metabase";
const LIB_SRC_PATH = __dirname + "/frontend/src/metabase-lib";
const ENTERPRISE_SRC_PATH =
  __dirname + "/enterprise/frontend/src/metabase-enterprise";
const TYPES_SRC_PATH = __dirname + "/frontend/src/metabase-types";
const CLJS_SRC_PATH = __dirname + "/frontend/src/cljs";
const TEST_SUPPORT_PATH = __dirname + "/frontend/test/__support__";
const BUILD_PATH = __dirname + "/resources/frontend_client";

// default WEBPACK_BUNDLE to development
const PATH = "app/dist/";
const staticBucketUrl =
  process.env.STATIC_BUCKET_URL || "https://static.footprint.network";
const CDN_PATH = `${staticBucketUrl}/app/dist/`;
const WEBPACK_BUNDLE = process.env.WEBPACK_BUNDLE || "development";
const cdnMode = process.env.CDN === "true";
const devMode = WEBPACK_BUNDLE !== "production";
const useFilesystemCache = process.env.FS_CACHE === "true";
const shouldUseEslint =
  process.env.WEBPACK_BUNDLE !== "production" &&
  process.env.USE_ESLINT === "true";
console.log("staticBucketUrlstaticBucketUrl", staticBucketUrl)
// Babel:
const BABEL_CONFIG = {
  cacheDirectory: process.env.BABEL_DISABLE_CACHE ? false : ".babel_cache",
};

const CSS_CONFIG = {
  localIdentName: devMode
    ? "[name]__[local]___[hash:base64:5]"
    : "[hash:base64:5]",
  importLoaders: 1,
};

const isUpgradeTest = staticBucketUrl.includes("static-upgrade-test");

const getEnv = envs => {
  console.log("xxxxxxxxxxxxxxxxxxxxxxxx", process.env)
  const res = {};
  envs.map(item => (res[item] = JSON.stringify(process.env[item])));
  console.log("getEnv", res);
  return res;
};

const DEFINE_ENV = {
  ...getEnv([
    "PROD_URL",
    "PRE_URL",
    "TEST_URL",
    "BETA_URL",
    "ALPHA_URL",

    "STATIC_BUCKET_URL",
    "STATIC_BUCKET_HK_URL",
    "STATIC_BUCKET_KEY_ID",
    "STATIC_BUCKET_KEY_SECRET",

    "HASURA_URL",
    "HASURA_DEV_URL",

    "GAIA_DAO_URL",
    "GAIA_DAO_DEV_URL",

    "JUPYTER_SERVER_URL",
    "JUPYTER_TOKEN",

    "SLACK_URL",

    "ARMS_PID",
  ]),
};

const config = (module.exports = {
  mode: devMode ? "development" : "production",
  context: SRC_PATH,

  // output a bundle for the app JS and a bundle for styles
  // eventually we should have multiple (single file) entry points for various pieces of the app to enable code splitting
  entry: {
    "app-main": "./app-main.js",
    "app-public": "./app-public.js",
    // "app-embed": "./app-embed.js",
    styles: "./css/index.css",
  },

  // output to "dist"
  output: {
    path: BUILD_PATH + "/app/dist",
    filename: "[name].bundle.[chunkhash].js",
    publicPath: cdnMode ? CDN_PATH : PATH,
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules|cljs/,
        use: [{ loader: "babel-loader", options: BABEL_CONFIG }],
      },
      // ...(shouldUseEslint
      //   ? [
      //       {
      //         test: /\.(tsx?|jsx?)$/,
      //         exclude: /node_modules|cljs|\.spec\.js/,
      //         use: [
      //           {
      //             loader: "eslint-loader",
      //             options: {
      //               rulePaths: [__dirname + "/frontend/lint/eslint-rules"],
      //             },
      //           },
      //         ],
      //       },
      //     ]
      //   : []),
      {
        test: /\.(eot|woff2?|ttf|svg|png)$/,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: [
          devMode
            ? "style-loader"
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: cdnMode ? CDN_PATH : "./",
                },
              },
          { loader: "css-loader", options: CSS_CONFIG },
          { loader: "postcss-loader" },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      ".webpack.js",
      ".web.js",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".css",
      ".svg",
    ],
    alias: {
      assets: ASSETS_PATH,
      fonts: FONTS_PATH,
      metabase: SRC_PATH,
      "metabase-lib": LIB_SRC_PATH,
      "metabase-enterprise": ENTERPRISE_SRC_PATH,
      "metabase-types": TYPES_SRC_PATH,
      "metabase-dev": `${SRC_PATH}/dev${devMode ? "" : "-noop"}.js`,
      cljs: CLJS_SRC_PATH,
      __support__: TEST_SUPPORT_PATH,
      style: SRC_PATH + "/css/core/index",
      ace: __dirname + "/node_modules/ace-builds/src-min-noconflict",
      // NOTE @kdoh - 7/24/18
      // icepick 2.x is es6 by defalt, to maintain backwards compatability
      // with ie11 point to the minified version
      icepick: __dirname + "/node_modules/icepick/icepick.min",
      // conditionally load either the EE plugins file or a empty file in the CE code tree
      "ee-plugins":
        process.env.MB_EDITION === "ee"
          ? ENTERPRISE_SRC_PATH + "/plugins"
          : SRC_PATH + "/lib/noop",
      "@ant-design/icons/lib/dist$": SRC_PATH + "/lib/ant-icon",
    },
  },
  cache: useFilesystemCache
    ? {
        type: "filesystem",
        buildDependencies: {
          // invalidates the cache on configuration change
          config: [__filename],
        },
      }
    : undefined,
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          name: "vendor",
        },
      },
    },
  },

  plugins: [
    // Extracts initial CSS into a standard stylesheet that can be loaded in parallel with JavaScript
    // NOTE: the filename on disk won't include "?[chunkhash]" but the URL in index.html generated by HtmlWebpackPlugin will:
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css",
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      filename: "../../index.html",
      chunksSortMode: "manual",
      chunks: ["vendor", "styles", "app-main"],
      template: __dirname + "/resources/frontend_client/index_template.html",
      inject: "body",
      // Using default of "defer" creates race-condition when applying whitelabel colors (metabase#18173)
      scriptLoading: "blocking",
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackPlugin({
      filename: "../../public.html",
      chunksSortMode: "manual",
      chunks: ["vendor", "styles", "app-public"],
      template: __dirname + "/resources/frontend_client/index_template.html",
      inject: "body",
      scriptLoading: "blocking",
      alwaysWriteToDisk: true,
    }),
    // new HtmlWebpackPlugin({
    //   filename: "../../embed.html",
    //   chunksSortMode: "manual",
    //   chunks: ["vendor", "styles", "app-embed"],
    //   template: __dirname + "/resources/frontend_client/index_template.html",
    //   inject: "head",
    //   scriptLoading: "blocking",
    //   alwaysWriteToDisk: true,
    // }),
    new InterpolateHtmlPlugin({ STATIC_BUCKET_URL: staticBucketUrl }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: __dirname + "/resources/frontend_client/app/dist",
    }),
    new webpack.BannerPlugin({
      banner:
        "/*\n* This file is subject to the terms and conditions defined in\n * file 'LICENSE.txt', which is part of this source code package.\n */\n",
    }),
    new NodePolyfillPlugin(), // for crypto, among others
    new webpack.EnvironmentPlugin({
      WEBPACK_BUNDLE: "development",
    }),
    new MomentLocalesPlugin(),
    // new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({ "process.env": DEFINE_ENV }),
  ],
});

if (WEBPACK_BUNDLE === "hot") {

  const localIpAddress = getLocalIpAddress("IPv4") || getLocalIpAddress("IPv6") || "0.0.0.0";

  const webpackPort = 8080;
  const webpackHost = `http://${localIpAddress}:${webpackPort}`
  config.target = "web";
  // suffixing with ".hot" allows us to run both `yarn run build-hot` and `yarn run test` or `yarn run test-watch` simultaneously
  config.output.filename = "[name].hot.bundle.js?[contenthash]";

  // point the publicPath (inlined in index.html by HtmlWebpackPlugin) to the hot-reloading server
  config.output.publicPath = webpackHost + "/" + config.output.publicPath;

  config.module.rules.unshift({
    test: /\.(tsx?|jsx?)$/,
    exclude: /node_modules|cljs/,
    use: [
      {
        loader: "babel-loader",
        options: {
          ...BABEL_CONFIG,
          plugins: ["@emotion", "react-refresh/babel"],
        },
      },
    ],
  });

  config.devServer = {
    host: "local-ip",
    port: webpackPort,
    allowedHosts: "auto",
    hot: true,
    client: {
      progress: true,
      overlay: false
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // tweak stats to make the output in the console more legible
    // TODO - once we update webpack to v4+ we can just use `errors-warnings` preset
    devMiddleware: {
      stats: {
        assets: false,
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        modules: false,
        color: true,
        hash: false,
        warnings: true,
        errorDetals: false,
      },
    },
    // if webpack doesn't reload UI after code change in development
    // watchOptions: {
    //     aggregateTimeout: 300,
    //     poll: 1000
    // }
    // if you want to reduce stats noise
    // stats: 'minimal' // values: none, errors-only, minimal, normal, verbose
  };

  config.plugins.unshift(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin({
      overlay: false,
    }),
  );
}

if (WEBPACK_BUNDLE !== "production") {
  // replace minified files with un-minified versions
  for (const name in config.resolve.alias) {
    const minified = config.resolve.alias[name];
    const unminified = minified.replace(/[.-\/]min\b/g, "");
    if (minified !== unminified && fs.existsSync(unminified)) {
      config.resolve.alias[name] = unminified;
    }
  }

  // by default enable "cheap" source maps for fast re-build speed
  // with BETTER_SOURCE_MAPS we switch to sourcemaps that work with breakpoints and makes stacktraces readable
  config.devtool = process.env.BETTER_SOURCE_MAPS
    ? "inline-source-map"
    : "cheap-module-source-map";

  // helps with source maps
  config.output.devtoolModuleFilenameTemplate = "[absolute-resource-path]";
  config.output.pathinfo = true;

  config.plugins.push(
    new WebpackNotifierPlugin({
      excludeWarnings: true,
      skipFirstNotification: true,
    }),
  );
} else {
  config.plugins.push(
    new TerserPlugin({ parallel: true, test: /\.(tsx?|jsx?)($|\?)/i }),
  );

  config.devtool = "source-map";
}

if (cdnMode) {
  config.plugins.push(
    new WebpackAliyunOssPlugin({
      from: config.output.path,
      dist: "app/dist",
      region: isUpgradeTest ? "oss-us-east-1" : "oss-accelerate",
      bucket: isUpgradeTest ? "footprint-upgrade-test" : "footprint-imgs",
      accessKeyId: process.env.STATIC_BUCKET_KEY_ID,
      accessKeySecret: process.env.STATIC_BUCKET_KEY_SECRET,
      setHeaders(filePath) {
        return {
          "x-oss-object-acl": filePath.endsWith(".map") ? "private" : "default",
        };
      },
      test: false,
      overwrite: false,
      bail: true,
      quitWpOnError: true,
    }),
  );
}

function getLocalIpAddress(ipFamily) {
  const networkInterfaces = os.networkInterfaces();
  const interfaces = Object.keys(networkInterfaces)
    .map(iface => networkInterfaces[iface])
    .reduce((interfaces, iface) => interfaces.concat(iface));

  const externalInterfaces = interfaces.filter(iface => !iface.internal)

  const { address } = externalInterfaces.filter(({ family }) => family === ipFamily).shift();
  return address;
}
