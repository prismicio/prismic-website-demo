const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production'
});

module.exports = prodWebpackConfig;
