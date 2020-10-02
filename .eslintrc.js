const warnInProduction = process.env.NODE_ENV === "production" ? "warn" : "off";

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": warnInProduction,
    "no-debugger": warnInProduction,
    "@typescript-eslint/ban-ts-ignore": warnInProduction,
    "@typescript-eslint/camelcase": warnInProduction
  }
};
