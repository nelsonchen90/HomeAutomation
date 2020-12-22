import express from 'express'
import { createUser, getUserByUsername } from '../../db/UserTable/index.js'

const userOperationRoute = express.Router()
userOperationRoute.use(express.json())

const requireCredentialFieldsMiddleware = (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({
      errorCode: 'input/missing input',
      errorMessage: 'Missing fields in user credential'
    })
    return
  }
  next()
}

// create user
userOperationRoute.use('/signup', requireCredentialFieldsMiddleware)
userOperationRoute.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const encrpytedPassword = encrytPassword(password)
  let response
  let statusCode
  try {
    await createUser(username, encrpytedPassword)
    response = {
      status: 'execution/success',
      message: 'Successfully signed up'
    }
    statusCode = 200
  } catch (e) {
    response = {
      errorCode: 'execution/add user failure'
    }
    if (e.code === 'ConditionalCheckFailedException') {
      statusCode = 409
      response.errorMessage = 'Same user name exists. Choose a different one'
    } else {
      statusCode = 500
      response.errorMessage = `Server error: ${e.message}`
    }
  } finally {
    res.status(statusCode).json(response)
  }
})

const encrytPassword = (plainText) => {
  return plainText
}

// delete user
userOperationRoute.delete('/', (req, res) => {

})

// AUTH
const authRouter = express.Router()
authRouter.use(express.json())
authRouter.use('/', requireCredentialFieldsMiddleware)
authRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  let response
  let statusCode
  try {
    response = await getUserByUsername(username)
    statusCode = 200
  } catch (e) {
    statusCode = 500
    response = e
  } finally {
    res.status(statusCode).json(response)
  }
})

export {
  userOperationRoute,
  authRouter
}
