import { getDynamoDBClient } from '../config/index.js'

const table = 'Users'

export const getUserByUsername = async (username) => {
  const docClient = getDynamoDBClient()
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: {
        username
      }
    }
    console.log(`Querying users by username: ${username}`)
    try {
      docClient.get(params, function (err, data) {
        console.log('get item')
        if (err) {
          console.error('Unable to query. Error:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          console.log('Query succeeded.')
          resolve(data.Item)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

// console.log('Querying for movies from 1992 - titles A-L, with genres and lead actor')

// const params = {
//   TableName: 'Movies',
//   ProjectionExpression: '#yr, title, info.genres, info.actors[0]',
//   KeyConditionExpression: '#yr = :yyyy and title between :letter1 and :letter2',
//   ExpressionAttributeNames: {
//     '#yr': 'year'
//   },
//   ExpressionAttributeValues: {
//     ':yyyy': 1992,
//     ':letter1': 'A',
//     ':letter2': 'L'
//   }
// }

// docClient.query(params, function (err, data) {
//   if (err) {
//     console.log('Unable to query. Error:', JSON.stringify(err, null, 2))
//   } else {
//     console.log('Query succeeded.')
//     data.Items.forEach(function (item) {
//       console.log(' -', item.year + ': ' + item.title +
//             ' ... ' + item.info.genres +
//             ' ... ' + item.info.actors[0])
//     })
//   }
// })
