const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = merge(config, {
  mode: "production",
  plugins: [
    // 配置插件
    // new BundleAnalyzerPlugin({
    //   // analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
    //   // generateStatsFile: true, // 是否生成stats.json文件
    // }),
  ],
});
