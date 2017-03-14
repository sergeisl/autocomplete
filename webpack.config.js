var webpack = require('webpack');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname + '/public/',
        publicPath: "./",
        filename: "app.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/]
            },
          
            {
                test: /\.jsx$/,
                loader: "react-hot!babel",
                exclude: [/node_modules/, /public/]
            },
           {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/, /public/]
            }
        ]

    },
 //   devtool: "source-map"
}