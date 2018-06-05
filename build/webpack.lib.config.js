const path = require('path');
const webpack = require('webpack');

const src = path.join(__dirname, '../src/ng-slick.js');
const dist = path.join(__dirname, '../dist');

module.exports = {
  entry: src,
  output: {
    path: dist,
    filename: 'ng-slick.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'angular': 'angular',
    'jquery': 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          sourceMap: true,
        },
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.(jpg|png|woff|woff2|gif|eot|ttf|svg)\??.*$/,
        loader: 'url-loader?limit=16384'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        unused: true
      },
      mangle: true,
      beautify: false,
      parallel: true,
      sourceMap: false
    })
  ]
};
