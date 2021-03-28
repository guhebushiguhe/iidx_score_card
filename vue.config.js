const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    chainWebpack: (config)=>{
        config.plugin('html')
            .tap(args => {
                args[0].title = "IIDX 速查工具v1.05";
                return args;
            })
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('layout',resolve('src/layout'))
            .set('base',resolve('src/base'))
            .set('static',resolve('src/static'))
    },
    // pages:{
    //     index: {
    //         entry: 'src/index/main.js',
    //         template: 'public/index.html',
    //         filename: 'index.html',
    //         title: 'IIDX 速查工具v1.05',
    //         chunks: ['chunk-vendors', 'chunk-common', 'index']
    //     }
    // }
}