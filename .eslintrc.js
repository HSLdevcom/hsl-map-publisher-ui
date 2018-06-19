module.exports = {
  extends: ["airbnb", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  parser: "babel-eslint",
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    "react/jsx-filename-extension": ["error", {
      "extensions": [".js"]
    }],
    "import/first": 0,
    "react/forbid-prop-types": 0,
    "react/no-array-index-key": 0,
    "react/jsx-closing-bracket-location": 0,
    "react/sort-comp": 0,
    "operator-assignment": 0
  },
};
