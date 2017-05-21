const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const buildDate = new Date().toISOString()

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './Frontend/src/app/app.js',
    css: './Frontend/src/assets/sass/app.sass'
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].js', // TODO
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      config: path.resolve(__dirname, '..', 'config', 'index.js'),
      vue: 'vue/dist/vue.common.js',
      '@': resolve('src'),
      assets: resolve('src/assets'),
      'style': resolve('src/assets/sass'),
      'style.module': resolve('src/assets/sass/3-modules'),
      'style.page': resolve('src/assets/sass/4-pages'),
      images: resolve('src/assets/images'),

      'web-assets': 'wwdcscholars-web-assets',
      'web-assets.style': 'wwdcscholars-web-assets/styles',

      'components': 'wwdcscholars-web-components'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!autoprefixer-loader!sass-loader?indentedSytax'
        }),
        include: [resolve('assets/sass')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      RELEASE: JSON.stringify(buildDate)
    })
  ]
}
