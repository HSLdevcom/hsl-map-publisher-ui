module.exports = {
  extends: ["airbnb", "prettier"],
  plugins: ["prettier"],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    "react/jsx-filename-extension": ["error", {
      "extensions": [".js"]
    }],
    "react/forbid-prop-types": 0,
    "prettier/prettier": ["warn", {
      singleQuote: true,
      trailingComma: "all",
      bracketSpacing: true,
    }]
  },
};
