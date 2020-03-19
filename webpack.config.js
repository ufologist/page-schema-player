const path = require("path");
var childProcess = require('child_process');

var webpack = require('webpack');
var yargs = require('yargs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");

var pkg = require('./package.json');

var argv = yargs.argv;
var isProd = argv.mode === 'production';

/**
 * 获取 Git 最近一次的提交日志
 * 
 * @return {string}
 */
function getLatestGitLog() {
    var log = '';
    try {
        log = childProcess.execSync('git log -1 --pretty=format:"%h %cd" --date=iso').toString();
    } catch (error) {
        console.warn('getLatestGitLog error', error.message);
    }
    return log;
}

module.exports = {
  entry: {
    app: "./src/index.tsx",

    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
    "css.worker": "monaco-editor/esm/vs/language/css/css.worker",
    "html.worker": "monaco-editor/esm/vs/language/html/html.worker",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker"
  },
  module: {
    rules: [
      {
        test: /froala-editor\//,
        parser: {
          amd: false,
        }
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: { injectType: "styleTag" }
          },
          "css-loader"
        ]
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader",
            options: { injectType: "styleTag" }
          },
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      // fix: Sortable is not a constructor
      // https://github.com/baidu/amis/issues/353#issuecomment-599015094
      'sortablejs$': 'sortablejs/Sortable.js'
    }
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         name: 'chunk-vendors',
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         chunks: 'initial'
  //       },
  //       common: {
  //         name: 'chunk-common',
  //         minChunks: 2,
  //         priority: -20,
  //         chunks: 'initial',
  //         reuseExistingChunk: true
  //       }
  //     }
  //   },
  // },
  devtool: false,
  devServer: {
    host: '0.0.0.0',
    useLocalIp: true,
    overlay: true,
    disableHostCheck: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      // chunks: ['chunk-vendors', 'chunk-common', 'app']
      chunks: ['app']
    }),
    new webpack.BannerPlugin(`${pkg.name} | ${getLatestGitLog()} | (c) ${pkg.author}`)
  ],
  output: {
    filename: isProd ? "[name].[chunkhash:7].js" : "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ''
  }
};