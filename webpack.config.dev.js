const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: [
        'webpack/hot/only-dev-server',
        './example/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),//打包后的文件存放的地方
        filename: "bundle.js",//打包后输出文件的文件名
        publicPath: "/"
    },
    resolve: {
        extensions: [".jsx", ".js", ".json"]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        hot: true,
        publicPath: '/',
        inline: true,
        port: 8000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']//在webpack-dev中不能使用--hot
            },

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: "source-map",
};