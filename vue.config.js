module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.symlinks(true)
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://demo.ekuai.tech/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
