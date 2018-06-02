const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const history = require("connect-history-api-fallback");
const convert = require("koa-connect");
const webpackServeWaitpage = require("webpack-serve-waitpage");

module.exports = {
  mode: "development",
  entry: ["babel-polyfill", "./src/app/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "js/bundle.js",
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
            cacheDirectory: true,
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

      // add new plugins here
    ],
  },

  plugins: [
    // new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: "public/index.html",
    }),
  ],

  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
    extensions: [".web.js", ".js", ".json", ".web.jsx", ".jsx"],
  },

  devtool: "source-map", //eval is faster
};

// Modifications for webpack-serve
// see webpack-serve docs for add and middlewares

module.exports.serve = {
  content: [__dirname],
  add: (app, middleware, options) => {
    app.use(convert(history()));
    app.use(webpackServeWaitpage(options));
  },
};
