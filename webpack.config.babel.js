const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WriteJsonPlugin = require('write-json-webpack-plugin');
const webpack = require('webpack');

const config = require('./src/common/config');
const manifest = require('./src/manifest');
const packageJson = require('./package.json');

const sassLoader = {
  loader: 'sass-loader',
  options: {
    additionalData: `
      $namespace: ${config.namespace};
    `,
  },
};

const createConfig = (browser) => ({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  entry: {
    'content/content_medium': './src/content/content_medium.js',
    'content/content_medium_iframe': './src/content/content_medium_iframe.js',
    'content/content_substack': './src/content/content_substack.js',
    'background/background': './src/background/background.js',
    'app/App': './src/app/App.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist') + '/' + browser,
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
    new webpack.DefinePlugin({
      'process.env.BROWSER': JSON.stringify(browser),
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false, // prevent cleaning of copied files (https://github.com/webpack-contrib/copy-webpack-plugin/issues/385#issuecomment-508914721)
      cleanOnceBeforeBuildPatterns: [
        path.resolve(__dirname, 'dist') + '/' + browser,

        // exclude
        `!.gitkeep`,
      ]
    }),
    new WriteJsonPlugin({
      object: manifest(browser, packageJson.version),
      filename: 'manifest.json',
      pretty: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/background/background.html', to: 'background' },
        { from: 'src/app/index.html', to: 'app' },
        { from: 'src/app/assets', to: 'app/assets' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        //minimize: true,
        compress: {
          evaluate: false,
          inline: 1, // https://github.com/mishoo/UglifyJS2/issues/2842
        },
        output: {
          ascii_only: true,
        },
      },
    })],
  },
});

module.exports = ['chrome', 'firefox'].map(createConfig);
