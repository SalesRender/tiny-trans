/* eslint-disable */
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const port = 8080;
const host = 'localhost';
const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

module.exports = {
  stats: 'minimal',
  context: src,
  entry: './index.ts',
  output: {
    path: dist,
    publicPath: `http://${host}:${port}/`,
  },
  devtool: 'source-map',
  devServer: {
    host,
    port,
    hot: true,
    historyApiFallback: true,
    overlay: true,
  },
  resolve: {
    modules: [src, 'node_modules'],
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HtmlPlugin({
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['cache-loader', 'ts-loader'],
        include: src,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['cache-loader', 'babel-loader'],
        include: src,
      },
    ],
  },
};
