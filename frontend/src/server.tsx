import { createReadStream } from 'fs'
import { join } from 'path'
import express from 'express'
import * as React from 'react'
import webpackMiddleware from 'webpack-dev-middleware'
import multistream from 'multistream'
import stringStream from 'string-to-stream'
import { renderToNodeStream } from 'react-dom/server'
import { renderStylesToNodeStream } from 'emotion-server'
import webpack from 'webpack'
import webpackConfig from '../webpack.config'
import App from './components/App'

const app = express()

console.log('WEBPACK CONFIG')
console.log(JSON.stringify(webpackConfig))

if (process.env.NODE_ENV === 'production') {
  app.get('/static/main.bundle.js', (req, res) => {
    createReadStream(join(__dirname, '..', 'dist', 'main.bundle.js'))
      .pipe(res)
  })
} else {
  const compiler = webpack(webpackConfig)
  app.use(webpackMiddleware(compiler))
}

app.use((req, res) => {
  const app = <App />
  const body = multistream([
    stringStream(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Camino Network</title>
</head>
<body>
  <div id="root">`),
    renderToNodeStream(app).pipe(renderStylesToNodeStream()),
    stringStream(`</div>
  <script src="/static/main.bundle.js"></script>
</body>
</html>`)
  ])

  res.status(200)
  res.set('Content-Type', 'text/html')
  body.pipe(res)
})

app.listen(8080, () =>
  console.log('camino-network running on http://127.0.0.1:8080')
)
