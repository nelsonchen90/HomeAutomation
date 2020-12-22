import { loadDevData } from './UsersLoadData.js'

export const initDB = async (dynamodb, dynamoDBClient) => {
  return new Promise((resolve, reject) => {
    const TableName = 'Users'

    const params = {
      TableName,
      KeySchema: [
        { AttributeName: 'username', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'username', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      }
    }

    dynamodb.createTable(params, async (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2))
        await loadDevData(dynamoDBClient)
        resolve(data)
      }
    })
  })
}

// const params = {
//   TableName
// }

// dynamodb.deleteTable(params, function (err, data) {
//   if (err) {
//     console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2))
//   } else {
//     console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2))
//   }
// })
