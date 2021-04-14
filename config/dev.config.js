const webpack = require('webpack');
const path = require('path');
const MiniCssExtactPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { getAppPath } = require('../utils/util');

module.exports = (defaultrcConfig) => {
  const { appOutputRoot = 'dist' } = defaultrcConfig;
  return {
    output: {
      pathinfo: true,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: process.env.PUBLIC_PATH || '/',
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      contentBase: getAppPath(appOutputRoot),
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 9000,
      sockHost: process.env.SOCK_HOST || '0.0.0.0',
      sockPort: process.env.SOCK_PORT || 9000,
      disableHostCheck: true,
      historyApiFallback: true,
      liveReload: true,
      // WebpackDevServer 默认的输出信息有点杂乱，这里自定义输出日志
      // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
      quiet: true,
      hot: true,
      writeToDisk: true,
      watchContentBase: true,
      publicPath: '/',
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtactPlugin({
        fileName: '[name].css',
        chunkFilename: '[name].css',
        ignoreOrder: false,
      }),
    ],
  };
}
