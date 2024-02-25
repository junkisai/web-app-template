/** @type {import('prettier').Config} */
const config = {
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  bracketSpacing: true,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  importOrder: ["^[./]", "^@/(.*)$"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      options: {
        parser: "typescript",
        importOrderParserPlugins: ["typescript", "jsx"],
      },
    },
  ],
};

module.exports = config;
