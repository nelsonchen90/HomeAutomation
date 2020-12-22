import express from 'express'
import USBSwitchRouter from './USBSwitch.js'
import { userOperationRoute, authRouter } from './userOperations.js'
import windowsSwitch from './windowsSwitch.js'

const apiRouter = express.Router()

apiRouter.use('/auth', authRouter)

// apiRouter.use('/', express.json())
apiRouter.use('/usbSwitch', USBSwitchRouter)

apiRouter.use('/windowsSwitch', windowsSwitch)

apiRouter.use('/user', userOperationRoute)

// fallback error handling
apiRouter.all('*', (req, res) => {
  console.log('Unknown api request')
  console.log(`[${req.method}] ${req.baseUrl}`)
  console.log(`From ip: ${req.ip}`)
  res.statusCode = 404
  res.contentType = 'text/plain'
  res.send('Unknown api endpoint, please check usage')
})

export default apiRouter
