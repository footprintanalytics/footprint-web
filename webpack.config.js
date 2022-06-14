/* eslint-env node */
/* eslint-disable import/no-commonjs */
const fs = require("fs");
const webpack = require("webpack");

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WebpackAliyunOssPlugin = require("webpack-aliyun-oss");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

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
const PATH = "app/dist/";
const CDN_PATH = `${process.env.STATIC_BUCKET_URL}/app/dist/`;

const NODE_ENV = process.env.NODE_ENV || "development";
const devMode = NODE_ENV !== "production";
const hotMode = NODE_ENV === "hot";
const cdnMode = process.env.CDN === "true";

const BABEL_CONFIG = {
  cacheDirectory: process.env.BABEL_DISABLE_CACHE ? false : ".babel_cache",
};

const CSS_CONFIG = {
  localIdentName: devMode
    ? "[name]__[local]___[hash:base64:5]"
    : "[hash:base64:5]",
  importLoaders: 1,
};

const isUpgradeTest = process.env.STATIC_BUCKET_URL.includes(
  "static-upgrade-test",
);

const getEnv = envs => {
  const res = {};
  envs.map(item => (res[item] = JSON.stringify(process.env[item])));
  console.log(res);
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

  entry: {
    "app-main": "./app-main.js",
    "app-public": "./app-public.js",
    // "app-embed": "./app-embed.js",
    styles: "./css/index.css",
  },

  output: {
    path: BUILD_PATH + "/app/dist",
    filename: "[name].bundle.[chunkhash].js",
    publicPath: cdnMode ? CDN_PATH : PATH,
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|cljs/,
        use: [{ loader: "babel-loader", options: BABEL_CONFIG }],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|cljs|\.spec\.js/,
        use: [
          {
            loader: "eslint-loader",
            options: {
              rulePaths: [__dirname + "/frontend/lint/eslint-rules"],
            },
          },
        ],
      },
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
    extensions: [".webpack.js", ".web.js", ".js", ".jsx", ".css", ".svg"],
    alias: {
      assets: ASSETS_PATH,
      fonts: FONTS_PATH,
      metabase: SRC_PATH,
      "metabase-lib": LIB_SRC_PATH,
      "metabase-enterprise": ENTERPRISE_SRC_PATH,
      "metabase-types": TYPES_SRC_PATH,
      cljs: CLJS_SRC_PATH,
      __support__: TEST_SUPPORT_PATH,
      style: SRC_PATH + "/css/core/index",
      ace: __dirname + "/node_modules/ace-builds/src-min-noconflict",
      icepick: __dirname + "/node_modules/icepick/icepick.min",
      "ee-plugins":
        process.env.MB_EDITION === "ee"
          ? ENTERPRISE_SRC_PATH + "/plugins"
          : SRC_PATH + "/lib/noop",
      "@ant-design/icons/lib/dist$": SRC_PATH + "/lib/ant-icon",
    },
  },

  cache: hotMode
    ? undefined
    : {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
      },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  plugins: [
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
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackPlugin({
      filename: "../../public.html",
      chunksSortMode: "manual",
      chunks: ["vendor", "styles", "app-public"],
      template: __dirname + "/resources/frontend_client/index_template.html",
      inject: "body",
      alwaysWriteToDisk: true,
    }),
    // new HtmlWebpackPlugin({
    //   filename: "../../embed.html",
    //   chunksSortMode: "manual",
    //   chunks: ["vendor", "styles", "app-embed"],
    //   template: __dirname + "/resources/frontend_client/index_template.html",
    //   inject: "body",
    //   alwaysWriteToDisk: true,
    // }),
    new InterpolateHtmlPlugin({
      STATIC_BUCKET_URL: process.env.STATIC_BUCKET_URL,
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: __dirname + "/resources/frontend_client/app/dist",
    }),
    new NodePolyfillPlugin(),
    new MomentLocalesPlugin(),
    // new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({ "process.env": DEFINE_ENV }),
  ],
});

if (devMode) {
  for (const name in config.resolve.alias) {
    const minified = config.resolve.alias[name];
    const unminified = minified.replace(/[.-\/]min\b/g, "");
    if (minified !== unminified && fs.existsSync(unminified)) {
      config.resolve.alias[name] = unminified;
    }
  }

  config.devtool = process.env.BETTER_SOURCE_MAPS
    ? "inline-source-map"
    : "cheap-module-source-map";

  config.output.devtoolModuleFilenameTemplate = "[absolute-resource-path]";
  config.output.pathinfo = true;

  config.plugins.push(
    new WebpackNotifierPlugin({
      excludeWarnings: true,
      skipFirstNotification: true,
    }),
  );
} else {
  config.devtool = "source-map";

  config.module.rules = config.module.rules.filter(rule => {
    return Array.isArray(rule.use)
      ? rule.use[0].loader !== "eslint-loader"
      : true;
  });

  config.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: { format: { comments: false } },
      extractComments: false,
    }),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
    }),
  ];

  // config.plugins.push(
  //   new BundleAnalyzerPlugin({ analyzerMode: "static", defaultSizes: "gzip" }),
  // );
}

if (hotMode) {
  config.target = "web";

  config.output.filename = "[name].hot.bundle.js?[contenthash]";
  config.output.publicPath = "http://localhost:8080/" + PATH;

  config.module.rules.unshift({
    test: /\.jsx$/,
    exclude: /node_modules|cljs|DragLayer\.jsx$/,
    use: [
      { loader: "react-hot-loader/webpack" },
      { loader: "babel-loader", options: BABEL_CONFIG },
    ],
  });

  config.devServer = {
    hot: true,
    inline: true,
    contentBase: "frontend",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    stats: "errors-warnings",
  };

  config.plugins.unshift(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  );
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
