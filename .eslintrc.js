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
    "prettier/prettier": ["error", {
      singleQuote: true,
      trailingComma: "all",
      bracketSpacing: true,
    }]
  },
};
