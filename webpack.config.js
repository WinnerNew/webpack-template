const path = require("path");
const chalk = require("chalk");
const glob = require("glob"); // 文件匹配模式
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html模版
const { VueLoaderPlugin } = require("vue-loader"); // vue加载器
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //样式抽离
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin"); //清楚未使用的css
const resolve = (relativePath) => path.resolve(__dirname, relativePath); // 根据相对路径获取绝对路径
const isDev = process.env.NODE_ENV === "development"; // 是否是开发模式
const PATHS = {
  src: path.join(__dirname, "src"),
};

module.exports = {
  entry: resolve("/src/main.js"),
  output: {
    path: resolve("./dist"),
    // hash 代表每次 webpack 在编译的过程中会生成唯一的 hash 值，在项目中任何一个文件改动后就会被重新创建，然后 webpack 计算新的 hash 值。
    // chunkhash 是根据模块计算出来的 hash 值，所以某个文件的改动只会影响它本身的 hash 值，不会影响其他文件。
    filename: "[name].[chunkhash:8].bundle.js",
    clean: true, //每次构建清除dist包 最新版webpack内置替代 clean-webpack-plugin
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: [resolve("./src")],
      },
      //js jsx文件
      {
        test: /(\.jsx|\.js)$/,
        use: [
          "cache-loader", //缓存
          {
            loader: "thread-loader", // 开启多进程打包 loader 都会在一个单独的 worker 池（worker pool）中运行
            options: {
              worker: 3,
            },
          },
          {
            loader: "babel-loader",
            //babel 在转译 js 过程中时间开销比价大，将 babel-loader 的执行结果缓存起来，重新打包的时候，直接读取缓存
            options: {
              cacheDirectory: true, // babel-loader 开启缓存 缓存位置： node_modules/.cache/babel-loader
            },
          },
        ],
        exclude: /node_modules/,
        // include: [path.resolve(__dirname, "src")],
      },
      // 样式文件
      {
        test: /\.(css|scss|sass)$/,
        use: [
          // "style-loader", // 通过 style 标签 将css内容添加到页面上 按需引入
          MiniCssExtractPlugin.loader, // 通过 link 标签 将CSS文件的形式引入到页面上 按需引入
          // isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          "cache-loader", // 获取前面 loader 转换的结果
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: ["autoprefixer"] } },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(less)$/,
        use: [
          // "style-loader", // 通过 style 标签 将css内容添加到页面上 按需引入
          MiniCssExtractPlugin.loader, // 通过 link 标签 将CSS文件的形式引入到页面上 按需引入
          // isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          "cache-loader", // 获取前面 loader 转换的结果
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: ["autoprefixer"] } },
          },
          "less-loader",
        ],
      },
      // 图片文件
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/,
        type: "asset",
        // 小于 10kb 的图片转 base64
        parser: {
          // 优点：减少请求数量 缺点：体积会更大
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
        // 大于10kb的图片打包后输出为
        generator: {
          filename: "static/images/[name].[hash:10][ext]",
        },
      },
      // 字体文件
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: "asset/resource", // 只会对文件原封不动的输出，不会转为base64格式
        //设置字体文件
        generator: {
          // 输出字体
          filename: "static/fonts/[name].[hash:10][ext]",
        },
      },
      // 媒体文件
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/media/[name][ext]", // 文件输出目录和命名
        },
      },
    ],
  },
  plugins: [
    // vue加载
    new VueLoaderPlugin(),
    // CSS抽离
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css", // 抽离css的输出目录和名称
    }),
    //清除未使用的css
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // }),
    // html模版生成
    new HtmlWebpackPlugin({
      title: "标题",
      favicon: resolve("./public/favicon.ico"), // 使用 http://localhost/ 不经网卡传输 访问会看不到ico 需要使用本机ip http://127.0.0.1/
      template: resolve("./public/index.html"),
      filename: "index.html",
      rootNode: `<div id='app'></div>`,
    }),
 
  ],
  //来自外部引入的模块 从输出的 bundle 中排除依赖
  externals: {
    vue: "Vue",
    "vue-router": "VueRouter",
  },
  //webpack解析模块时应该搜索的目录
  //webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
  resolve: {
    // 指定node_modules的路径，减少模块搜索层级
    modules: [path.resolve(__dirname, "node_modules")],
    // 文件引入时可忽略的扩展名
    // 高频文件后缀名放前面
    // 手动配置后，默认配置会被覆盖, 保留默认配置，可以用 ... 扩展运算符代表默认配置
    extensions: [".js", ".ts", ".jsx", ".json", ".vue", "..."],
    alias: {
      //配置别名
      "@": resolve("./src"),
      components: resolve("./src/components"),
      // import react的时候直接从指定的路径去找
      // react: path.resolve(__dirname, './node_modules/react/dist/react.min.js',
    },
    // 指定入口，避免不必要的分析
    mainFields: ["main"],
  },
};
