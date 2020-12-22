import express from 'express'

import { createUser, getUserByUsername } from '../../db/UserTable/index.js'
import { hashPassword, validatePassword } from '../../utils/paswordHashing.js'

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
  let response
  let statusCode
  try {
    const hashedPasswordssword = await hashPassword(password)
    await createUser(username, hashedPasswordssword)
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
    const user = await getUserByUsername(username)
    const isValid = user !== undefined && await validatePassword(password, user.password)
    statusCode = isValid ? 200 : 401
    if (isValid) {
      response = {
        status: 'login/success',
        message: 'Successfully login in'
      }
    } else {
      response = {
        errorCode: 'login/failure',
        errorMessage: 'Login failed. Credential doesn\'t match'
      }
    }
  } catch (e) {
    statusCode = 500
    response = e
    console.log(e)
  } finally {
    res.status(statusCode).json(response)
  }
})

export {
  userOperationRoute,
  authRouter
}
