module.exports = api => {
    api.render('./template')
    api.extendPackage({
        dependencies: {
            "pug": "^3.0.0",
            "pug-plain-loader": "^1.0.0",
            "ant-design-vue-findsoft": "^1.6.4",
        },
        devDependencies: {
            "vue-cli-plugin-ftp": "^1.0.2",
            "vue-cli-plugin-swagger-to-types": "^1.1.5",
        }
    })
    api.afterInvoke(() => {
        const { EOL } = require('os')
        const fs = require('fs')
        const contentMain = fs.readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' })
        const lines = contentMain.split(/\r?\n/g)
    
        const renderIndex = lines.findIndex(line => line.match(/render/))
        lines[renderIndex] += `${EOL}  router,`
    
        fs.writeFileSync(api.entryFile, lines.join(EOL), { encoding: 'utf-8' })
      })
}



