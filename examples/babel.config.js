module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'import',
      {
        libraryName: 'ant-design-vue-findsoft',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
