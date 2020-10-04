/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin } = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
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
  }
};
