#!/home/pi/.nvm/versions/node/v15.4.0/bin/node

import express from 'express'
import helmet from 'helmet'
import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import mainRoute from './routes/mainRoute.js'

const app = express()
const host = '0.0.0.0'
const isProd = process.env.NODE_ENV === 'production'
const port = 80
const httpsPort = isProd ? 443 : 3001
const appName = 'Home automation'

app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}))
app.use(helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'frame-ancestors': ["'self'", 'https://homeautomationbox.com']
  }
}))
app.set('title', appName)
app.use('/', mainRoute)

let exposedServer
if (isProd) {
  exposedServer = http.createServer(app)
  exposedServer.listen(port, host, () => {
    console.log(`${appName} listening at http://${host}:${port}`)
    console.log('pid is ' + process.pid)
  })
}

const securedServer = https.createServer({
  key: fs.readFileSync(path.join(path.resolve(), 'privkey.pem')),
  cert: fs.readFileSync(path.join(path.resolve(), 'fullchain.pem'))
}, app)
securedServer.listen(httpsPort, host, () => {
  console.log(`${appName} listening at https://${host}:${httpsPort}`)
  console.log('pid is ' + process.pid)
})

const handleExit = (signal) => {
  console.log(`Received ${signal}. Close my server properly.`)
  securedServer.close(() => {
    // better way to terminate
    process.exit(0)
  })
  if (exposedServer) {
    exposedServer.close(() => {
      // better way to terminate
      process.exit(0)
    })
  }
}
process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
