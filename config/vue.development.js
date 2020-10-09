/* eslint-disable @typescript-eslint/no-var-requires */
const BuildDatePlugin = require("./BuildDatePlugin");
const css = require("./SCSSVariables");

module.exports = {
  css,
  configureWebpack: {
    plugins: [BuildDatePlugin]
  }
};
