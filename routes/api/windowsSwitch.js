import express from 'express'
import wol from 'node-wol'
// import { getSharedIO } from '../../utils/socketIO.js'

const windowsSwitch = express.Router()

windowsSwitch.use(express.json())

windowsSwitch.post('/toggle', ({ body }, res) => {
  const isFromUser = body.targetMacAddress !== undefined
  const macAddress = isFromUser ? body.targetMacAddress : process.env.WIN_TARGET_MAC
  if (macAddress) {
    try {
      wol.wake(macAddress, (error) => {
        if (error) {
          res.status(500).json({
            errorCode: 'execution/failure',
            errorMessage: `Issue occurred while waking up the device ${isFromUser && `from ${body.targetMacAddress}`}`
          })
        }
        res.status(200).json({
          status: 'execution/success',
          message: 'Successfully requested target machine to be woken'
        })
      })
    } catch (e) {
      res.status(500).json({
        errorCode: 'execution/failure',
        errorMessage: e.message
      })
    }
  } else {
    res.status(body.targetMacAddress === undefined ? 400 : 500).json({
      errorCode: 'execution/missing-info',
      errorMessage: 'Mac address for the target is not provided or in the env variable'
    })
  }
})

windowsSwitch.get('/status', (req, res) => {
  res.status(200).json({
    status: 'not implemented'
  })
})

export default windowsSwitch
