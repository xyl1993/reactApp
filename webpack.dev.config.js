var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var publicPath = 'http://localhost:3000/';
const devProxyPath = 'http://localhost:7080/';  //192.168.60.200:8080
const buildProxyPath = 'http://58.221.243.90:7080/';  //192.168.30.16

const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

//happypack多进程打包
const HappyPack = require('happypack')
const os = require('os') //获取电脑的处理器有几个核心，作为配置传入
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

process.traceDeprecation = true;
module.exports = {
  entry: {
    vendor: [

    ],
    build: ['babel-polyfill', './src/app/app.module.js'],
  },
  output: {
    path: path.resolve(ROOT_PATH, './dist'),
    publicPath: publicPath,
    filename: '[name].js',
    pathinfo: true //开发环境
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: false,
    disableHostCheck: true,
    port: 3000,
    open: true,
    host: 'localhost',
    inline: true, //实时刷新
    // quiet: true, // necessary for FriendlyErrorsPlugin
    stats: {
      // colors: true,
      chunks: false
    },
    proxy: {
      '/HFSystem/*': {
        target: devProxyPath    //devProxyPath  //buildProxyPath
      }
    }
  },
  watch: true, // 开启监听文件更改，自动刷新
  watchOptions: {
    ignored: /node_modules/, //忽略不用监听变更的目录
    aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    poll: 1000 //每秒询问的文件变更的次数
  },
  resolve: {
    extensions: ['.js', '.css', '.json'],
    // 别名，可以直接使用别名来代表设定的路径以及其他
    alias: {
      // jquery: 'jquery/jquery.min.js',
      '@': resolve('src'),
      'scss_vars': '@/assets/common/styles.scss'
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader?sourceMap",
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')({
                  browsers: ['last 5 versions']
                }),
              ]
            }
          }

        ]
      },
      {
        test: /\.scss$/,
        loader: ["style-loader", "css-loader?sourceMap", //开发模式
          "sass-loader?sourceMap&includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib")
        ]
      },
      // {
      //   test: /\.js$/,
      //   use: "babel-loader?cacheDirectory",
      //   exclude: path.resolve(__dirname, "node_modules"),
      //   include: path.resolve(__dirname, 'src')
      // },
      {
        test: /\.jsx?$/,
        use: 'babel-loader?cacheDirectory',
        // loader: 'happypack/loader?id=happy-babel-js',
        exclude: path.resolve(__dirname, "node_modules"),
        include: path.resolve(__dirname, 'src')
      }, {
        test: /\.(png|jpg|gif|cur)$/,
        use: ["url-loader?limit=8192&name=images/[hash:8].[name].[ext]"]
      }, {
        test: /\.(woff|woff2|eot|ttf|otf|svg)(\?.*$|$)/,
        use: ["url-loader?importLoaders=1&limit=10000&name=fonts/[name].[ext]"]
      }, {
        test: /\.html$/,
        use: ["html-withimg-loader"]
      }
    ]
  },

  // 开启source-map，webpack有多种source-map，在官网文档可以查到//cheap-module-eval-source-map
  // devtool: 'eval', //开发环境cheap-module-eval-source-map
  externals: {
    // jquery: "jQuery", //如果要全局引用jQuery，不管你的jQuery有没有支持模块化，用externals就对了。
  },
  optimization: {
    // minimize: true,
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    runtimeChunk: {
      name: 'runtime',
    }
  },
  plugins: [
    // new UglifyJsPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: function () {
          return [autoprefixer, cssnext, precss, cssnano];
        },
        noParse: /node_modules\/(jquey|moment|chart\.js)/
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT_PATH, './src/index.html'),
      inject: true,
      filename: 'index.html',
      favicon: path.resolve(ROOT_PATH, './src/assets/favicon.ico')
    }),
    new ProgressBarPlugin({
      format: 'build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),
    // /*多进程压缩打包*/
    // new HappyPack({ //开启多线程打包
    //   id: 'happy-babel-js',
    //   loaders: ['babel-loader?cacheDirectory=true'],
    //   threadPool: happyThreadPool
    // }),
  ]
}
