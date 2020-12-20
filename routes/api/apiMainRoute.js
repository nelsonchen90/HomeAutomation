import express from 'express'
import USBSwitchRouter from './USBSwitch.js'

const apiRouter = express.Router()

// apiRouter.use('/', express.json())
apiRouter.use('/usbSwitch', USBSwitchRouter)

// fallback error handling
apiRouter.use('*', (req, res) => {
  console.log('Unknown api request')
  console.log(`[${req.method}] ${req.baseUrl}`)
  console.log(`From ip: ${req.ip}`)
  res.statusCode = 404
  res.contentType = 'text/plain'
  res.send('Unknown api endpoint, please check usage')
})

export default apiRouter
