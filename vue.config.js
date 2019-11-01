const publicPath = {
    production: '/scar/',
    development: '/'
};

module.exports = {
    lintOnSave: true,
    assetsDir: 'assets',
    publicPath: publicPath[process.env.NODE_ENV],
    pages: {
        index: {
            entry: 'src/main.js',
            title:  process.env.VUE_APP_TITLE,
            iconfont: process.env.VUE_APP_ICONFONT
        }
    },
    productionSourceMap: false
};