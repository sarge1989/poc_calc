const path = require('path');
var webpack = require('webpack')

module.exports = {
  entry: {
    index: './js/index.js', // replace with calculator js name
  },
  output: {
    // default output to ./dist folder
    filename: '[name].bundle.js', // Retain original file name
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/i,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};