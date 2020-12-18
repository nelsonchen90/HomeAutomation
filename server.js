#!/home/pi/.nvm/versions/node/v15.4.0/bin/node

import express from 'express'
import helmet from 'helmet'
import fs from 'fs'
import https from 'https'
import path from 'path'
import mainRoute from './routes/mainRoute.js'

const app = express()
const host = '0.0.0.0'
const isProd = process.env.NODE_ENV === 'production'
const httpsPort = isProd ? 443 : 3000
const appName = 'Home automation'

app.use(helmet())
app.set('title', appName)
app.use('/', mainRoute)

const server = https.createServer({
  key: fs.readFileSync(path.join(path.resolve(), 'server.key')),
  cert: fs.readFileSync(path.join(path.resolve(), 'server.cert'))
}, app)

server.listen(httpsPort, host, () => {
  console.log(`${appName} listening at https://${host}:${httpsPort}`)
  console.log('pid is ' + process.pid)
})

const handleExit = (signal) => {
  console.log(`Received ${signal}. Close my server properly.`)
  server.close(() => {
    // better way to terminate
    process.exit(0)
  })
}
process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
