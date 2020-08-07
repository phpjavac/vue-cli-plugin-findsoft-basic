module.exports = {
  publicPath: './',
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
  // 解决按需引入插件css引入失败
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/': {
        target: 'http://192.168.1.147:8080/eg',
        changeOrigin: true,
        ws: false,
      },
    },
  },
};
