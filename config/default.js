const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { getAppPath } = require('../utils/util');
const { staticMediaResPath } = require('../utils/contants');

let defaultrcBabelrcPath = getAppPath('.babelrc');

try {
  defaultrcBabelrcPath = fs.existsSync(defaultrcBabelrcPath) ? defaultrcBabelrcPath : false;
} catch (err) {
  throw err;
}

const miniCssLoader = {
  loader: MiniCssExtractPlugin.loader,
};

const postCssLoader = {
  loader: require.resolve('postcss-loader'),
  options: {
    postcssOptions: {
      plugins: [
        require('postcss-flexbugs-fixes'),
        [
          require('postcss-preset-env'),
          {
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          },
        ],
      ],
    },
  },
};

const getDefaultRuleConfig = (appPath) => [
  {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      require.resolve('thread-loader'),
      {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: getAppPath('./.cache/.babel'),
          cacheCompression: false,
          compact: false,
          configFile: defaultrcBabelrcPath,
        },
      },
    ],
    exclude: /node_modules/,
  },
  {
    test: /\.scss$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      miniCssLoader,
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            localIdentName: '[local]-[hash:base64:10]',
            exportLocalsConvention: 'camelCase',
          },
          importLoaders: 2,
        },
      },
      postCssLoader,
      {
        loader: require.resolve('sass-loader'),
      },
    ],
  },
  {
    test: /\.css$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      miniCssLoader,
      {
        loader: require.resolve('css-loader'),
      },
      postCssLoader,
    ],
  },
  {
    test: /\.(png|jpg|svg|gif)$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      {
        loader: require.resolve('url-loader'),
        options: {
          name: `${staticMediaResPath}/[name].[hash:8].[ext]`,
          limit: 8192,
        },
      },
    ],
  },
];

const getDefaultPluginsConfig = (appPath) => [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: getAppPath(`./${appPath}/index.html`),
  }),
];

const getDefaultTsConfig = () => {
  return {
    plugins: new TsConfigPathsPlugin({
      configFile: getAppPath('./tsconfig.json'),
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      logLevel: 'INFO',
      baseUrl: getAppPath('.'),
      mainFields: ['browser', 'main'],
    }),
  };
};

const getStyleLintConfig = (stylelintConfigPath, appPath) => {
  return {
    plugins: new StyleLintPlugin({
      configFile: getAppPath(stylelintConfigPath || `./stylelint.config.js`),
      context: getAppPath(`./${appPath}`, ''),
      failOnError: true,
      quiet: false,
    }),
  };
};

module.exports = {
  getDefaultPluginsConfig,
  getDefaultTsConfig,
  getStyleLintConfig,
  getDefaultRuleConfig,
};
