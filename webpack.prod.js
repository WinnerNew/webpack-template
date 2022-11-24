const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const prodConfig = merge(baseConfig, {
  mode: "production",
  plugins: [],
  optimization: {
    splitChunks: {
      minSize: 20000, // 最小尺寸，拆分出来的一个包的大小最小为minSize 默认 20kb
      maxSize: 20000, // 将大于maxSize的包，拆成不小于minSize的包 默认 0， 一般会设置和minSize一样
      minChunks: 2, // 引入的包，至少被导入几次 默认 1次
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 2, //2>0  nodulesmodules里的模块将优先打包进vendor
        },
        commons: {
          name: "commons", //async异步代码分割 initial同步代码分割 all同步异步分割都开启
          chunks: "all", //async异步导入 nitoal同步导入  all 异步/同步
          minSize: 30000, //字节 引入的文件大于30kb才进行分割
          priority: 0, //优先级，先打包到哪个组里面，值越大，优先级越高
        },
      },
    },
  },
});
module.exports = (env, argv) => {
  console.log("env, argv", env, argv); // 打印环境变量
  console.log("process.env.NODE_ENV==>", process.env.NODE_ENV);
  if (process.env.NODE_ENV == "analyzer") {
    prodConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "server", // 不启动展示打包报告的http服务器
        generateStatsFile: true, // 是否生成stats.json文件
      })
    );
  }
  return prodConfig;
};
