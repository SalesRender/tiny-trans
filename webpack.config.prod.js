/* eslint-disable */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const port = 8080;
const host = 'localhost';
const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

module.exports ={
  stats: 'minimal',
  context: src,
  entry: './index.tsx',
  output: {
    path: dist,
    publicPath: `http://${host}:${port}/`,
  },
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
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
