/* eslint-disable @typescript-eslint/no-var-requires */
const BuildDatePlugin = require("./BuildDatePlugin");

module.exports = {
  configureWebpack: {
    plugins: [BuildDatePlugin]
  }
};
