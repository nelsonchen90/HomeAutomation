import express from 'express'
import usbSwitch, { getPowerFlag } from '../../utils/usbSwitch.js'
import { adapter as usbSwitchSkillAdaptor } from '../../alexa/skills/usbSwitch/usbSwitchSkill.js'

const USBSwitchRouter = express.Router()

USBSwitchRouter.post('/alexa', usbSwitchSkillAdaptor.getRequestHandlers())

USBSwitchRouter.get('/:value', (req, resp, next) => {
  next()
})

USBSwitchRouter.param('value', (req, resp, next, value) => {
  const canHandle = getPowerFlag(value) !== undefined
  if (!canHandle) {
    resp.statusCode = 400
    resp.send('Bad request. Please provide one of the following values: \'on\', \'off\' or \'status\'')
  } else {
    usbSwitch(value, (stdout, stderr, error, powerFlag) => {
      if (error) {
        resp.send(`Error: \n ${error}`)
        resp.statusCode = 500
      } else {
        resp.send(`USB ${powerFlag}: \n ${stdout}\n`)
        resp.statusCode = 200
      }
    })
  }
})

export default USBSwitchRouter
