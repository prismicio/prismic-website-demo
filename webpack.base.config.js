const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseWebpackConfig = {
  entry: path.resolve('./assets/js/main.js'),
  output: {
    path: path.resolve('./public/bundles'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};

module.exports = baseWebpackConfig;
