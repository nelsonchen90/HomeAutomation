import axios from 'axios'
import publicIP from 'public-ip'

const API_KEY = process.env.GODADDY_KEY
const API_SECRET = process.env.GODADDY_SECRET

const getReord = async () => {
  const response = await goDaddyRequest(
    '/records/A/@',
    'get'
  )
  return response
}

const patchRecord = async (newIP) => {
  const newRecord = [{
    data: newIP,
    name: '@',
    ttl: 3600,
    type: 'A'
  }]
  const patchResponse = await goDaddyRequest(
    '/records/A/@',
    'put',
    newRecord
  )
  return patchResponse
}

const goDaddyRequest = (path, method, body) => {
  return axios.request({
    url: path,
    baseURL: 'https://api.godaddy.com/v1/domains/homeautomationbox.com',
    method,
    data: body,
    headers: {
      Authorization: `sso-key ${API_KEY}:${API_SECRET}`
    }
  }
  ).then((response) => {
    return {
      ok: true,
      response: response.data
    }
  }).catch((err) => {
    return {
      ok: false,
      response: (err.response && err.response.data) || err.message
    }
  })
}

const updateIP = async () => {
  console.log('Checking if public IP changed')
  const currIP = await publicIP.v4()
  const record = await getReord()
  if (record.ok && record.response && record.response.length > 0) {
    const recordIP = record.response[0].data
    if (currIP !== recordIP) {
      console.log(`Public IP changed! new IP is ${currIP}, record IP is ${recordIP}`)
      const patchRes = await patchRecord(currIP)
      if (!patchRes.ok) {
        console.error('Failed to update IP on godaddy')
        console.error(patchRes.response)
      } else {
        console.log('Updated IP on godaddy, will take a while to be in effect..')
      }
    } else {
      console.log(`Keep calm, public IP is up-to-date: ${recordIP}`)
    }
  } else {
    console.error('Issue with godaddy api call')
    console.error(record.response)
  }
}

const setupCheckInterval = (interval) => {
  updateIP()
  setInterval(updateIP, interval)
}

export default setupCheckInterval
