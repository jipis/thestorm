const path = require('path');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
  const basePath = '/thestorm/';
  const contentBase = (env && env.production) ? 'dist/dist' : 'public/dist';
  const htmlIndexPath = path.resolve(__dirname, 'index.ejs');

  const prodCssLoaders = [
    { loader: MiniCssExtractPlugin.loader, options: {esModule: true} },
    { loader: 'css-loader', options: {sourceMap: false} },
    { loader: 'sass-loader', options: { sassOptions: { outputStyle: 'compressed' }, sourceMap: false } },
  ];

  const devCssLoaders = [
    'style-loader',
    { loader: 'css-loader', options: { sourceMap: true } },
    { loader: 'sass-loader', options: { sassOptions: { outputStyle: 'expanded' }, sourceMap: true } },
  ];

  const cssLoaders = (env && env.production) ? prodCssLoaders : devCssLoaders;

  const LAST_UPDATED = JSON.stringify((new Date()).toISOString().slice(0, 10));
  const VERSION = JSON.stringify((env && env.production) ? process.env.VERSION || '' : 'dev');
  let ENVIRONMENT = 'prod';
  let isDevelopment = false;

  if (!/v\d+\.\d+\.\d+/.test(process.env.TAG_OR_BRANCH)) { // assumes we are only releasing v#.#.# versions now
    isDevelopment = true;
    if (process.env.TAG_OR_BRANCH === 'develop') {
      ENVIRONMENT = 'staging';
    } else {
      ENVIRONMENT = 'dev';
    }
  }

  console.log(`Version: ${VERSION}; Environment: ${ENVIRONMENT}`);
  console.log("template", htmlIndexPath);

  let allPlugins = [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(ENVIRONMENT),
      LAST_UPDATED,
      VERSION,
    }),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      filename: 'index.html',
      hash: env && env.production,
      inject: 'body',
      lang: 'en',
      template: htmlIndexPath,
      title: 'THESTORM - UIv4 Under Development',
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean);

  let optimizations = {};
  if (env && env.production) {
    allPlugins.push(new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }));
    optimizations.minimizer = [new TerserPlugin({}), new CssMinimizerPlugin()];
  }

  return {
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
    },
    devtool: 'inline-source-map',
    entry: {
      app: './src/pages/index.jsx',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [
                  isDevelopment && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
        },
        {
          test: /\.(gif|jpg|png|svg)$/,
          exclude: /node_modules/,
          use: ['file-loader'],
        },
        {
          test: /\.(css|less)$/,
          include: [
            path.resolve(__dirname, "src/static/styles"),
            path.resolve(__dirname, 'node_modules/ag-grid-community/dist/styles'),
            path.resolve(__dirname, 'node_modules/react-bootstrap-typeahead/css'),
            path.resolve(__dirname, 'node_modules/react-calendar/dist'),
            path.resolve(__dirname, 'node_modules/react-dual-listbox/lib'),
            path.resolve(__dirname, 'node_modules/react-toastify/dist'),
          ],
          use: cssLoaders,
        },
      ],
    },
    optimization:  optimizations,
    output: {
      path: path.resolve(__dirname, contentBase),
      publicPath: (env && env.production) ? basePath + 'dist/' : 'auto',
      filename: '[name].[contenthash].js',
    },
    plugins: allPlugins,
    resolve: {
      alias: {
        Styles: path.resolve(__dirname, 'src/static/styles/'),
        echarts$: path.resolve(__dirname, 'node_modules/echarts/dist/echarts-en.min'),
      },
      extensions: [ '.js', '.jsx', '.less', '.css', '.gif', '.jpg', '.png', '.svg' ],
      modules: [
        "node_modules",
        path.resolve(__dirname, 'src'),
      ],
    },
    stats: {
      assetsSort: '!size',
      modulesSort: '!size',
      source: false,
    },
  };
};
