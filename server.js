#!/home/pi/.nvm/versions/node/v15.4.0/bin/node

import express from 'express'
import helmet from 'helmet'
import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import mainRoute from './routes/mainRoute.js'
import { setupSharedIO } from './utils/socketIO.js'
import { setupDynamoDB } from './db/config/index.js'

const app = express()
const host = '0.0.0.0'
const isProd = process.env.NODE_ENV === 'production'
const port = isProd ? 80 : 3000
const httpsPort = isProd ? 443 : 3001
const appName = 'Home automation'

setupDynamoDB()

app.use(helmet())
app.use(cookieParser())
app.set('title', appName)
app.use('/', mainRoute)

let securedServer
let io
if (isProd) {
  const securedServer = https.createServer({
    key: fs.readFileSync(path.join(path.resolve(), 'privkey.pem')),
    cert: fs.readFileSync(path.join(path.resolve(), 'fullchain.pem'))
  }, app)
  securedServer.listen(httpsPort, host, () => {
    console.log(`${appName} listening at https://${host}:${httpsPort}`)
    console.log('pid is ' + process.pid)
  })
  io = new Server(securedServer)
}

const exposedServer = http.createServer(app)
exposedServer.listen(port, host, () => {
  console.log(`${appName} listening at http://${host}:${port}`)
  console.log('pid is ' + process.pid)
})
if (!isProd) {
  io = new Server(exposedServer)
}

io.on('connection', (socket) => {
  console.log('a user connected')
  io.emit('socket message', 'this is socket msg')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

setupSharedIO(io)

const handleExit = (signal) => {
  console.log(`Received ${signal}. Close my server properly.`)
  exposedServer.close(() => {
    // better way to terminate
    process.exit(0)
  })
  if (securedServer) {
    securedServer.close(() => {
      // better way to terminate
      process.exit(0)
    })
  }
}
process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
