import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { hashPassword } from '../../utils/paswordHashing.js'

export const loadDevData = async (docClient) => {
  const devData = path.join(fileURLToPath(import.meta.url), '../userdata.json')
  const allMovies = JSON.parse(readFileSync(devData, 'utf8'))
  allMovies.forEach(async (user) => {
    const encryptedPassword = await hashPassword(user.password)
    const params = {
      TableName: 'Users',
      Item: {
        username: user.username,
        password: encryptedPassword
      },
      ConditionExpression: 'attribute_not_exists(username)'
    }
    docClient.put(params, function (err, data) {
      if (err) {
        console.error('Unable to add movie', user.username, '. Error JSON:', JSON.stringify(err, null, 2))
      } else {
        console.log('PutItem succeeded:', user.username)
      }
    })
  })
}
