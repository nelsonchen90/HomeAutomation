import express from 'express'
import path from 'path'
import USBSwitchRouter from './USBSwitch.js'

const mainRouter = express.Router()

mainRouter.get('/', (req, resp) => {
  if (req.accepts('html')) {
    resp.redirect('/static')
  } else {
    resp.contentType('text')
    resp.send('Home automation')
  }
})

const dir = path.join(path.resolve(), 'client')
console.log(dir)

mainRouter.use('/static', express.static(dir))

mainRouter.use('/api/v1/usbSwitch', USBSwitchRouter)

// should be the last route for fallback
mainRouter.get('*', (req, res) => {
  res.redirect('/')
})

export default mainRouter
