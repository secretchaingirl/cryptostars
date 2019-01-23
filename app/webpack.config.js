const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/app.js",
    mode: "development",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    ],
    devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
};
