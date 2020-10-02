/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { DefinePlugin, HashedModuleIdsPlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  configureWebpack: {
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "[name].[contenthash:8].js"
    },

    optimization: {
      minimizer: [new TerserPlugin({ parallel: true })],
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            enforce: true,
            name(module) {
              // from https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            }
          }
        }
      }
    },

    plugins: [
      new HashedModuleIdsPlugin(),

      // Build date
      new DefinePlugin({
        "process.env": {
          BUILD_DATE: (() => {
            const now = new Date();
            const year = now.getFullYear();
            let month = now.getMonth() + 1;
            let day = now.getDate();
            if (month < 10) {
              month = "0" + month;
            }
            if (day < 10) {
              day = "0" + day;
            }
            return year.toString() + month + day;
          })()
        }
      })
    ]
  },

  parallel: true,
  publicPath: "/",
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/public/service-worker.js",
      exclude: [/\.map$/, /manifest\.json$/, /stats\.json$/]
    }
  }
};
