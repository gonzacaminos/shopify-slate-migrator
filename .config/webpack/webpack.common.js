const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {config, htmlPlugin} = require('./utils');

module.exports = {
  stats: 'minimal',
  entry: config.entry,
  output: {
    path: path.join(config.path.shopify, '/assets'),
    chunkFilename: "[name].chunk.js",
    filename: `[name].dist.js`,
  },
  resolve: {
    extensions: ['*', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../../src/'),
      '@shopify-directory': path.resolve(__dirname, '../../shopify/')
    }
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'template.gift_card'
      },
      name: "vendor",
    },
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    rules: [
     
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      ... (() => {
        const rules = []

        const loaders = [
          { test: /\.(css|postcss)$/i },
          { test: /\.s[ac]ss$/i, loader: 'sass-loader' },
        ]

        loaders.forEach((element, index) => {
          rules.push({
            test: element.test,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: require(path.resolve(__dirname, '../postcss.config.js'))
                }
              }
            ]
          })

          if (element.loader) rules[index].use.push(element.loader)
        })

        return rules
      })()
    ]
  },
  plugins: [
    /**
     * Clean files with the 'dist' or 'chunk' keyword in their filename
     * docs: https://github.com/johnagan/clean-webpack-plugin
     */
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*.dist.js', '**/*.dist.css', '**/*.chunk*']
    }),
    /**
     * docs: https://webpack.js.org/plugins/mini-css-extract-plugin
     */
    new HtmlWebpackPlugin({
      ...htmlPlugin,
      filename: path.join(config.path.shopify, '/snippets/script-tags.liquid'),
      template: path.resolve(__dirname, './script-tags.html'),
    }),

    new HtmlWebpackPlugin({
      ...htmlPlugin,
      filename: path.join(config.path.shopify, '/snippets/style-tags.liquid'),
      template: path.resolve(__dirname, './style-tags.html')
    }),

    new MiniCssExtractPlugin({
        filename: (pathData) => {
          // return the thing you've updated
          return `${pathData.chunk.name.replace('.js', "")}.dist.css`;
        },
    }),
  ]
}