var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'lib/ng-slick.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ng-slick.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'angular': 'angular'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  devtool: 'source-map'
};
