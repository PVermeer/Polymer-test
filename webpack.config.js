const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/app/app.ts',
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  devtool: process.env.WEBPACK_SERVE ? 'inline-source-map' : 'nosources-source-map',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  serve: {
    add: (app) => { app.use(convert(history())); },
    devMiddleware: {
      stats: 'minimal'
    },
    hotClient: { logLevel: 'silent' }
  },
  optimization: {
    // Isn't working for some reason...
    // splitChunks: {
    //   chunks: 'all'
    // },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          'css-loader'
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.ts', 'tsx', '.js', '.css', '.scss', '.sass', '.html'],
  }, plugins: [

    process.env.WEBPACK_SERVE ? new CleanWebpackPlugin() : new CleanWebpackPlugin('./dist'),

    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, './src/index.html'),
        to: '.',
        ignore: ['.*']
      },
      {
        from: resolve(__dirname, './src/styles.css'),
        to: '.',
        ignore: ['.*']
      },
      {
        from: resolve(__dirname, './src/manifest.json'),
        to: '.',
        ignore: ['.*']
      },
      {
        from: resolve(__dirname, './src/static/'),
        to: '.',
        ignore: ['.*']
      },
    ]),

    // Service worker
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html',
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 10,
            },
          },
        },
        {
          urlPattern: new RegExp('^https://fonts\.(googleapis|gstatic)\.com/'),
          handler: 'staleWhileRevalidate',
        }
      ],
    }),
  ]
};
