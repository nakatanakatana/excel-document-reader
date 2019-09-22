const path = require('path');
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    resolve: {
      alias: {
        '@app': path.join(__dirname, './src')
      }
    }
  },
  publicPath:
    process.env.NODE_ENV === 'production' ? 'excel-document-reader/' : '/'
};
