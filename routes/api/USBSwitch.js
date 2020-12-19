import express from 'express'
import usbSwitch from '../../utils/usbSwitch.js'

const USBSwitchRouter = express.Router()

USBSwitchRouter.post('/alexa', (req, res) => {
  console.log(`req body: \n ${JSON.stringify(req.body)}`)
  res.json(req.body)
})

USBSwitchRouter.get('/:value', (req, resp, next) => {
  next()
})

USBSwitchRouter.param('value', (req, resp, next, value) => {
  setUsbSwitch(value, (stdout, stderr, error, powerFlag) => {
    if (error) {
      resp.send(`Error: \n ${error}`)
      resp.statusCode = 500
    } else {
      resp.send(`USB ${powerFlag}: \n ${stdout}\n`)
      resp.statusCode = 200
    }
  })
  next()
})

const setUsbSwitch = (value, cb) => {
  let powerFlag
  switch (value) {
    case 'on':
      powerFlag = true
      break
    case 'off':
      powerFlag = false
      break
    case 'status':
      powerFlag = 'status'
      break
  }
  if (powerFlag) {
    usbSwitch(powerFlag, (stdout, stderr, error) => cb(stdout, stderr, error, powerFlag))
  }
}

export default USBSwitchRouter
