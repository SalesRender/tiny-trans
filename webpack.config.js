/* eslint-disable */
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const port = 8080;
const host = 'localhost';
const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

module.exports = (_, options) => {
  const isDevMode = options.mode === 'development';

  return {
    stats: 'minimal',
    context: src,
    entry: './index.tsx',
    output: {
      path: dist,
      publicPath: `http://${host}:${port}/`,
    },
    devtool: isDevMode && 'source-map',
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
      // new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin(),
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
};
