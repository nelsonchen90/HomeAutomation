import { getDynamoDBClient } from '../config/index.js'

const table = 'Users'

const createUser = async (username, saltedPassword) => {
  const docClient = getDynamoDBClient()
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      ConditionExpression: 'attribute_not_exists(username)',
      Item: {
        username,
        password: saltedPassword
      }
    }
    console.log('Adding a new user...')
    try {
      docClient.put(params, function (err, data) {
        if (err) {
          console.error('Unable to add user. Error JSON:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          console.log('Added user:', JSON.stringify(data, null, 2))
          resolve(data)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

export default createUser
