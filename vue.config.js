const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: "docs",
  assetsDir: "static",
  // rules:[
  //     {
  //         test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  //         loader: 'url-loader',
  //         options: {
  //         limit: 10000,
  //         name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
  //         }
  //     }
  // ],
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "IIDX 速查工具v1.05";
      return args;
    });
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("layout", resolve("src/layout"))
      .set("base", resolve("src/base"))
      .set("static", resolve("src/static"));
  },
  devServer: {
    proxy: {
      // 代理跨域
      "/datav": {
        // 代理url关键字
        target: "https://geo.datav.aliyun.com", // 需要代理的地址
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          "^/datav": "",
        },
        // 突破host和origin的限制
        headers: {
          referer: "http://datav.aliyun.com",
          origin: "http://datav.aliyun.com",
        },
      },
    },
  },
};
