import express from 'express'
import usbSwitch from '../../utils/usbSwitch.js'

const USBSwitchRouter = express.Router()

USBSwitchRouter.post('*', (req, res) => {
  console.log('received a post request')
  console.log(`req body: \n ${JSON.stringify(req.body)}`)
  res.json(req.body)
})

USBSwitchRouter.get('/:value', (req, resp, next) => {
  next()
})

USBSwitchRouter.param('value', (req, resp, next, value) => {
  let powerFlag
  switch (value) {
    case 'on':
      powerFlag = true
      break
    case 'off':
      powerFlag = false
      break
    case 'status':
    default:
      powerFlag = 'status'
  }
  usbSwitch(powerFlag, (stdout, stderr, error) => {
    if (error) {
      resp.send(`Error: \n ${error}`)
      resp.statusCode = 500
    } else {
      resp.send(`USB ${powerFlag}: \n ${stdout}\n`)
      resp.statusCode = 200
    }
  })
})

export default USBSwitchRouter
