const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const path = require("path");
const WebpackBar = require("webpackbar"); //编译进度条
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"); //打包输出信息优化
const port = 8080 | "auto";

// const address = require("address");
const devConfig = merge(config, {
  mode: "development",
  stats: "errors-only", //编译时webpack只输出报错信息 friendly-errors-webpack-plugin
  devtool: "source-map", //开发模式开启 sourse-map
  // stats: {
  //   env: false, // 是否展示 --env 信息
  // colors: {
  //   green: "\u001b[38;5;6m",
  // },
  //   chunks: false, // 是否添加关于 chunk 的信息
  //   assets: false, // 是否展示资源信息
  //   modules: false, // 是否添加关于构建模块的信息
  //   children: false, // 是否添加关于子模块的信息
  // },

  devServer: {
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      const port = devServer.server.address().port;
      console.log("Listening on port:", port);
    },
    // https: true, //开启https访问
    hot: true, //热更新
    historyApiFallback: true, //开启history 模式 当使用 HTML5历史 API 时，index.html 页面可能必须代替任何404响应。通过将其设置为 true 来启用 devServer.history 的 ApiFallback
    // open: true, //编译完自动打开浏览器
    compress: true, //开启gzip压缩  //响应头 ->Content-Encoding: gzip
    port, //自动使用一个可用端口
    //开发环境中设置静态资源目录默认public
    //开启静态资源 false不使用静态资源
    static: {
      //指定我们的public文件夹为静态资源目录
      directory: path.join(__dirname, "./public"),
      //指定我们要通过/public访问到directory设置的静态资源
      //（这个很重要如果不设置默认是通过 / 访问directory设置的静态资源，会和默认访问index.html冲突）
      publicPath: "./public",
    },
    client: {
      // progress: true, //显示编译进度
      // logging: "info", //在浏览器中设置日志级别
      //全屏显示
      overlay: {
        errors: true, //全屏显示报错信息
        warnings: false, //忽略警告信息
      },
      // webSocketTransport: "ws", //为客户端单独选择当前的 devServer 传输模式
    },
    // webSocketServer: "ws",
    // 启动时通过 ZeroConf 网络广播你的开发服务器
    // bonjour: {
    //   type: "http",
    //   protocol: "udp",
    // },
    proxy: {
      "/api": {
        //请求/api/user, 会被代理到请求 http://github.com/api/user
        target: "https://github.com/",
        pathRewrite: { "^/api": "" }, // /api/user 现在会被代理到请求 https://github.com/user
        changeOrigin: true, // 解决跨域:target是域名的话，需要这个参数，本地会虚拟一个服务器接收你的请求并代你发送该请求
        secure: false, // 默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果你想要接受，只要设置 secure: false
      },
      "/api2": {
        //请求/api2/user, 会被代理到请求 http://127.0.0.1:8081
        target: "http://127.0.0.1:8081/",
        pathRewrite: { "^/api": "" }, // /api2/user 现在会被代理到请求 http://127.0.0.1:8081/user
      },
    },
    //开发服务器白名单
    allowedHosts: [
      "host.com",
      "subdomain.host.com",
      "subdomain2.host.com",
      "host2.com",
    ],
  },
  plugins: [
    // function () {
    //   this.hooks.done.tap("done", (stats) => {
    //     console.log("??", stats);
    //     if (
    //       stats.compilation.errors &&
    //       stats.compilation.errors.length &&
    //       process.argv.indexOf("--watch") == -1
    //     ) {
    //       console.log("build error");
    //       process.exit(1);
    //     }
    //   });
    // },
    // 进度条
    new WebpackBar({
      color: "#409eff", // 默认green，进度条颜色支持HEX
      basic: true, // 默认true，启用一个简单的日志报告器
      profile: true, // 默认false，启用探查器。
    }),
    //优化打包信息
    new FriendlyErrorsWebpackPlugin({
      // 成功的时候输出
      compilationSuccessInfo: {
        messages: ["App running at:" + ` Local: http://localhost:${port}`],
        notes: [`Network: http://${require("ip").address()}:${port}`],
      },
      // 是否每次都清空控制台
      clearConsole: true,
    }),
  ],
});
module.exports = (mode) => {
  console.log("process.env.NODE_ENV=", mode, devConfig, process.env.NODE_ENV); // 打印环境变量
  return devConfig;
};
