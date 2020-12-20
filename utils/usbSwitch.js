import { exec } from 'child_process'

const setUsbSwitch = (value, cb) => {
  const powerFlag = getPowerFlag(value)
  if (powerFlag !== undefined) {
    usbSwitch(powerFlag, (stdout, stderr, error) => cb(stdout, stderr, error, powerFlag))
  }
}

export const getPowerFlag = (value) => {
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
  return powerFlag
}

const usbSwitch = (value, cb) => {
  const powerOn = value === true ? 1 : 0
  console.log(`turning power flag to: ${value}`)
  const execCB = (err, stdout, stderr) => {
    if (cb && typeof cb === 'function') {
      cb(stdout, stderr, err)
    }
  }
  if (value === 'status') {
    exec('uhubctl', execCB)
    return
  }
  exec(`uhubctl -l 1-1 -p 2 -a ${powerOn}`, execCB)
}

export const usbSwitchPromise = async (value) => {
  const powerOn = getPowerFlag(value) === true ? 1 : 0
  const promise = new Promise((resolve, reject) => {
    const execCB = (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      resolve({
        stderr,
        stdout
      })
    }
    if (value === 'status') {
      exec('uhubctl', execCB)
    } else {
      exec(`uhubctl -l 1-1 -p 2 -a ${powerOn}`, execCB)
    }
  })
  return promise
}

export default setUsbSwitch
