import express from 'express'
import USBSwitchRouter from './USBSwitch.js'

const apiRouter = express.Router()

apiRouter.use('*', express.json())
apiRouter.use('/usbSwitch', USBSwitchRouter)

export default apiRouter
