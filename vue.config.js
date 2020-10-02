if (process.env.NODE_ENV === "production") {
  module.exports = require("./config/vue.production.js");
} else {
  module.exports = require("./config/vue.development.js");
}
