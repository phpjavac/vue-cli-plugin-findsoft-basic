module.exports = {
  lintOnSave: false,
  publicPath: './',
  devServer: {
    proxy: {
      '/': {
        target: 'http://192.168.1.147:8080/eg',
        changeOrigin: true,
        ws: false,
      },
    },
  },
  pluginOptions: {
    toTypes: {
      host: 'http://192.168.1.147:8080/eg/v2/api-docs',
      TypesPath: './src/types/api.d.ts',
    },
    ftp: {
      host: '192.168.1.147',
      remoteFtpPath: 'DISK-D/findsoft_test/tomcat8/webapps/eg/',
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
};
