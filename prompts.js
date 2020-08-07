module.exports = [
    {
        name: `serverPath`,
        type: 'input',
        message: '请输入后台接口地址',
        validate: input => !!input,
        default: ''
    },
    {
        name: `SwaageApiPath`,
        type: 'input',
        validate: input => !!input,
        message: '请输入后台SwaageApi地址',
        default: ''
    }

]