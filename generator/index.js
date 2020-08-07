module.exports = (api, options) => {
    api.render('./template')
    api.extendPackage({
        scripts: {
            dev: 'vue-cli-service getTypes && vue-cli-service serve',
            getTypes: 'vue-cli-service getTypes',
        },
        dependencies: {
            "lodash": "^4.17.19",
            "axios": "^0.19.2",
            "pug": "^3.0.0",
            "less-loader": "^6.2.0",
            "pug-plain-loader": "^1.0.0",
            "ant-design-vue-findsoft": "^1.6.4",
        },
        devDependencies: {
            "@babel/plugin-transform-runtime": "^7.11.0",
            "babel-plugin-import": "^1.13.0",
            "@types/lodash": "^4.14.158",
            "vue-cli-plugin-ftp": "^1.0.2",
            "vue-cli-plugin-swagger-to-types": "^1.1.5",
        }
    })
    // 基础 vue.config.js 参数设置
    api.extendPackage({
        vue: {
            lintOnSave: false,
            // baseUrl Deprecated since Vue CLI 3.3, 使用 publicPath 替代
            publicPath: './',
            devServer: {
                proxy: {
                  '/': {
                    target: options.serverPath,
                    changeOrigin: true,
                    ws: false,
                  },
                },
              },
            pluginOptions: {
                toTypes: {
                    host: options.SwaageApiPath,
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
        },
    })
}



