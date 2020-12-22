import AWS from 'aws-sdk'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDB } from '../UserTable/UsersCreateTable.js'
import { loadDevData } from '../UserTable/UsersLoadData.js'

let dynamoDBClient
let dynamoDB

export const setupDynamoDB = async () => {
  const isProd = process.env.NODE_ENV === 'production'
  const shouldInitDB = process.env.INIT_DB === 'true'
  const configFileName = isProd ? 'prod.json' : 'dev.json'
  const filePath = path.join(fileURLToPath(import.meta.url), `../${configFileName}`)
  console.log(filePath)
  AWS.config.loadFromPath(filePath)
  dynamoDB = new AWS.DynamoDB()
  dynamoDBClient = new AWS.DynamoDB.DocumentClient()
  if (!isProd || shouldInitDB) {
    initDB(dynamoDB, dynamoDBClient)
  }
}

export const getDynamoDBClient = () => dynamoDBClient
export const getDynamoDB = () => dynamoDB
