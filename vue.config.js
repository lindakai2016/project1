const publicPath = {
    production: '/scar/',
    development: '/'
};

// const CompressionPlugin = require("compression-webpack-plugin");

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
    productionSourceMap: false,
    // configureWebpack: () => {
    //     if(process.env.NODE_ENV == "production") {
    //         return {
    //             plugins: [
    //                 new CompressionPlugin({
    //                     algorithm: "gzip",
    //                     test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
    //                     threshold: 10240,
    //                 })
    //             ],
    //         }
    //     }
    // },
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({
                bypassOnDebug: true
            })
            .end();
    }
};