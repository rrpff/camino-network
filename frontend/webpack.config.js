const path = require('path')
const assert = require('assert')

const MODE = process.env.NODE_ENV
assert(MODE, 'process.env.NODE_ENV must be defined')

const BABEL_RULE = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',
        '@babel/preset-react'
      ],
      plugins: [
        'emotion',
        'react-hot-loader/babel'
      ]
    }
  }
}

module.exports = {
  mode: MODE,
  entry: {
    main: [path.resolve(__dirname, 'src', 'client.tsx')]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static'
  },
  module: {
    rules: [
      BABEL_RULE
    ]
  }
}
