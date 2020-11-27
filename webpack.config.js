const path = require('path'),
      htmlWebpackPlugin = require('html-webpack-plugin'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin'),
      webpack = require('webpack'),
      miniCssExtractPlugin = require('mini-css-extract-plugin'),
      autoPrefixer = require('autoprefixer'),
      uglifyJsPlugin = require('uglifyjs-webpack-plugin'),
      OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],

    output :{
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/main.js'
    },

    mode: 'development',

    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                test: /\.css$/,
                use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            }
        ]
    },

    optimization: {
        minimizer: [
            new uglifyJsPlugin({
                exclude: /node_modules/,

            }),

            new OptimizeCssAssetsPlugin(),
        ],
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: true,
        writeToDisk: true,
        stats: 'errors-only',
    },

    plugins: [
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            }
        }),

        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),

        new miniCssExtractPlugin({
            filename: 'css/style.css'
        }),

        new webpack.LoaderOptionsPlugin({
            options: {
                'postcss': [autoPrefixer()],
            }
        }),
    ]
};