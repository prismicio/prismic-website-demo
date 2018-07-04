const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development'
});

module.exports = devWebpackConfig;
