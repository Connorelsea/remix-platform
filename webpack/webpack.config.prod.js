const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const webpack = require("webpack")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

// Bundle analyzer plugins
var WebpackBundleSizeAnalyzerPlugin = require("webpack-bundle-size-analyzer")
  .WebpackBundleSizeAnalyzerPlugin
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin
var Visualizer = require("webpack-visualizer-plugin")

const WebappWebpackPlugin = require("webapp-webpack-plugin")

module.exports = {
  mode: "production",
  entry: ["babel-polyfill", "./src/app/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "js/[hash].bundle.js",
    chunkFilename: "js/[name].chunk.js",
  },
  module: {
    rules: [
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ttf$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "media/[name].[hash:8].[ext]",
        },
      },

      // Process .js files with babel
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true, // use .babelrc
          },
        },
      },

      // Load .graphql files
      { test: /\.graphql$/, loader: "webpack-graphql-loader" },

      // Load fonts correctly
      // {
      //   test: /\.ttf$/,
      //   loader: "url-loader", // or directly file-loader
      //   include: path.resolve(
      //     __dirname,
      //     "node_modules/react-native-vector-icons"
      //   ),
      // },

      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
      // {
      //   // Exclude `js` files to keep "css" loader working as it injects
      //   // it's runtime that would otherwise processed through "file" loader.
      //   // Also exclude `html` and `json` extensions so they get processed
      //   // by webpacks internal loaders.
      //   exclude: [/\.js$/, /\.html$/, /\.json$/],
      //   loader: require.resolve("file-loader"),
      //   options: {
      //     name: "static/media/[name].[hash:8].[ext]",
      //   },
      // },

      // add new loaders here
    ],
  },

  plugins: [
    // new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      title: "Remix",
      template: "public/index.html",
    }),

    new WebappWebpackPlugin("./logo.svg"),

    new CompressionPlugin({
      cache: true,
      algorithm: "gzip",
    }),

    new WebpackBundleSizeAnalyzerPlugin("bundle-report.txt"),

    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-visual-report.html",
    }),

    new Visualizer(),

    // add new plugins here
  ],

  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
    extensions: [".web.js", ".js", ".json", ".web.jsx", ".jsx"],
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: true,
          mangle: true,
        },
      }),
    ],
  },

  devtool: "cheap-module-source-map",
}
