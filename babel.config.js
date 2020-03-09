module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        chrome: "60",
        firefox: "55",
      },
      useBuiltIns: "usage",
      corejs: {
        version: 3,
        proposals: true
      }
    }],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "babel-plugin-styled-components"
  ],
};
