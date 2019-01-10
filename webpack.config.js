const path = require('path');

const HtmlPlugin = require('html-webpack-plugin');

const root = process.cwd();

module.exports = {
  devtool: 'source-map',
  bail: false,
  mode: 'development',
  entry: path.join(__dirname, 'src', 'Init.tsx'),
  output: {
    filename: 'assets/[name].js',
    chunkFilename: 'assets/[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')]
      }
    ]
  },
  plugins: [new HtmlPlugin()],
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx', '.css'],
    modules: [root, path.resolve(root, 'src'), 'node_modules']
  },
  devServer: {
    port: 3001
  }
};
