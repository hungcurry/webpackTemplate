const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');



// template HTML共用header、footer
let fs = require('fs');
const headerTemplate = fs.readFileSync(__dirname + '/src/template/header.html');
const footerTemplate = fs.readFileSync(__dirname + '/src/template/footer.html');

// 多頁pages
let htmlPages = ['index', 'about', 'contact' ]; 
let multipleHtmlPlugins = htmlPages.map((name) => {
  return new HtmlWebpackPlugin({
    title: 'Custom template',
    template: path.resolve(__dirname, `./src/pages/${name}.html`),
    filename: `${name}.html`,
    header: headerTemplate,
    footer: footerTemplate,
    inject: 'body',
    chunks: [ 'main','vendor',`${name}` ],
    // excludeChunks: [`${name}`]
  });
});

console.log(multipleHtmlPlugins);


console.log(`... ${process.env.NODE_ENV} ...`);
module.exports = {
  // 路徑解析
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('src/css'),
      path.resolve('src/scss'),
      path.resolve('src/js'),
      path.resolve('src/js/Module'),
      path.resolve('src/assets/txt'),
      path.resolve('src/assets/images'),
      path.resolve('node_modules')
    ],
    extensions: ['.js']
  }, 
  // 抽離node檔案,變vendor.js
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  // 入口
  entry: {
    main: 'main.js',
    index: 'index.js',
    about: 'about.js',
    contact: 'contact.js',
  },
  // 輸出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].[hash:8].js',
    assetModuleFilename: './assets/images/[hash:8][ext]',
  },
  // 模式 development / production
  mode: process.env.NODE_ENV,
  // 讀取 Loaders
  module: {
    rules: [
      {
        test: /\.css$|\.s[ac]ss$/i,
        // use: ["style-loader", "css-loader"], // css注入 js
        use: [ 
          MiniCssExtractPlugin.loader, // 分拆 css
          {
            loader: 'css-loader', 
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          },
        ], 
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
        include: path.resolve('.'),
      },
      // 圖片
      {
        test: /\.(png|jpg|gif|jpe?g||webp)$/i,
        type: 'asset/resource',
        use:[
          {
            loader: 'image-webpack-loader',// 圖片壓縮
            options: {
              disable: process.env.NODE_ENV === 'production' ? false : true,
              mozjpeg: {
                progressive: true,
                quality: 90,
              },
              optipng: {
                enabled: false, // 表示不啟用這一個圖片優化器
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75, // 配置選項表示啟用 WebP 優化器
              },
            },
          },
        ],
        include: path.resolve('src/assets'),
        exclude: path.resolve('./node_modules'),
      },
      {
        test: /\.svg$/i,
        type: 'asset/inline',
        include: path.resolve('src/assets'),
        exclude: path.resolve('./node_modules'),
      },
      // 字形
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        include: path.resolve('src/assets'),
        exclude: path.resolve('./node_modules'),
      },
    ],
  },
  // 插件
  plugins: [
    // 單一HTML
    // new HtmlWebpackPlugin({
    //   title: 'Custom template',
    //   template: path.resolve(__dirname, './src/pages/index.html'),
    //   inject: 'body',
    // }),
    //-------------------------
    // HTML共用header、footer
    ...multipleHtmlPlugins,
    new MiniCssExtractPlugin({
      filename : './css/all.min.[hash:8].css'
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./src/assets/txt", to: "./assets/txt" },
      ],
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    // 壓縮
    new CompressionPlugin(), 
  ],
  // devServer
  devtool : 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true,
    hot: false, 
    liveReload: true,
    host: '192.168.1.104',
  },  
};
