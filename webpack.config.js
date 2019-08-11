// ------------------------------------------------------------------------------
// name: webpack.config
// author: 喵大斯( h5devs.com/h5devs.net )
// created: 2019/4/23 21:48
// ------------------------------------------------------------------------------

const path = require('path');

function resolve(...dir) {
  return path.join(__dirname, ...dir);
}

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      '@mudas/storage': resolve('packages')
    }
  }
};
