const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.join(__dirname),
    mode: 'production',
    resolve: {
        mainFields: ['module', 'main']
    },
    entry: {
        extension: './src/extension.ts',
    },
    target: 'node',
    node: {
        __dirname: false
    },
    resolve: {
        mainFields: ['module', 'main'],
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        'sourceMap': true,
                    }
                }
            }]
        }]
    },
    externals: {
        'vscode': 'commonjs vscode',
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'out'),
        libraryTarget: 'commonjs',
    },
    devtool: false,
    plugins: [
        new CopyWebpackPlugin([
            { from: './out/**/*', to: '.', ignore: ['*.js', '*.js.map'], flatten: true }
        ])
    ],  
};
