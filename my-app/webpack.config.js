const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./public/index.html",
    favicon: "./public/favicon.ico",
    filename: "./index.html"
});

const cssPlugin = new MiniCssExtractPlugin({
    filename: "./index.css",
});


module.exports = {
    entry: './src/index.tsx',
    devtool: 'eval-source-map',
    mode: 'development',
    devServer: {
        watchFiles: ["src/**/*", "public/**/*"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: "postcss-loader",
                    },
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  MiniCssExtractPlugin.loader,
                  // Translates CSS into CommonJS
                  {
                    loader: "css-loader",
                    options: {
                        importLoaders: 2,
                    }
                },
                  "postcss-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },
            {
                test: /\.svg$/,
                loader: "@svgr/webpack",
                options: {
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'removeViewBox',
                                active: true,
                            }
                        ]
                    }
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [htmlPlugin, cssPlugin]
};
