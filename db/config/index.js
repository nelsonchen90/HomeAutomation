import AWS from 'aws-sdk'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDB } from '../UserTable/UsersCreateTable.js'

let dynamoDBClient
let dynamoDB

export const setupDynamoDB = async () => {
  const isProd = process.env.NODE_ENV === 'production'
  const shouldInitDB = process.env.INIT_DB === 'true'
  if (!isProd) {
    const filePath = path.join(fileURLToPath(import.meta.url), '../dev.json')
    AWS.config.loadFromPath(filePath)
  } else {
    AWS.config.update({ region: 'us-east-1' })
  }
  dynamoDB = new AWS.DynamoDB()
  dynamoDBClient = new AWS.DynamoDB.DocumentClient()
  if (!isProd || shouldInitDB) {
    try {
      await initDB(dynamoDB, dynamoDBClient)
    } catch (e) {
      console.log(e.message)
    }
    console.log('done init db')
  }
}

export const getDynamoDBClient = () => dynamoDBClient
export const getDynamoDB = () => dynamoDB
