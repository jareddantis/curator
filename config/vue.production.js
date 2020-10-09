/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { HashedModuleIdsPlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const BuildDatePlugin = require("./BuildDatePlugin");
const css = require("./SCSSVariables");

module.exports = {
  css,
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Curator";
      return args;
    });
  },
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

    plugins: [new HashedModuleIdsPlugin(), BuildDatePlugin]
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
