import express from 'express'
import jwt from 'jsonwebtoken'
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

// delete user
userOperationRoute.delete('/', (req, res) => {

})

// update user
userOperationRoute.patch('/', (req, res) => {

})

// AUTH
const authRouter = express.Router()
authRouter.use(express.json())
authRouter.use('/login', requireCredentialFieldsMiddleware)
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body
  let response
  let statusCode
  let token
  try {
    const user = await getUserByUsername(username)
    const isValid = user !== undefined && await validatePassword(password, user.password)
    statusCode = isValid ? 200 : 401
    if (isValid) {
      delete user.password
      token = jwt.sign(user, 'secret')
      response = {
        status: 'login/success',
        message: 'Successfully login in',
        authToken: token
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
    if (statusCode === 200) {
      res.cookie('access_token', `Bearer ${token}`)
    }
    res.status(statusCode).json(response)
  }
})

// create user
authRouter.use('/signup', requireCredentialFieldsMiddleware)
authRouter.post('/signup', async (req, res) => {
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

authRouter.all('*', (req, res) => {
  return res.sendStatus(404)
})

export {
  userOperationRoute,
  authRouter
}
