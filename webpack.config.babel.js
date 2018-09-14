const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./src/common/config');

const sassLoader = {
  loader: 'sass-loader',
  options: {
    data: `
      $namespace: ${config.namespace};
    `,
  },
};

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  entry: {
    'content/content': './src/content/content.js',
    'content/content_iframe': './src/content/content_iframe.js',
    'background/background': './src/background/background.js',
    'app/App': './src/app/App.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          sassLoader,
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
      { from: 'src/manifest.json', to: '.' },
      { from: 'src/background/background.html', to: 'background' },
      { from: 'src/app/index.html', to: 'app' },
      { from: 'src/app/assets', to: 'app/assets' },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
};
