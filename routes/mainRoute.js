import express from 'express'
import path from 'path'
import jwtMid from 'express-jwt'
import apiRouter from './api/apiMainRoute.js'
import { authRouter } from './api/userOperations.js'

const mainRouter = express.Router()

mainRouter.get('/', (req, resp, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return resp.redirect('https://' + req.get('host') + req.url)
  }
  if (req.accepts('html')) {
    next()
  } else {
    resp.contentType('text')
    resp.send('Home automation')
  }
})

const authMiddlware = jwtMid({
  secret: 'secret',
  algorithms: ['HS256'],
  credentialsRequired: false,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    }
    return null
  }
})

const publicDir = path.join(path.resolve(), 'public')
mainRouter.use('/signin', express.static(publicDir))
mainRouter.use('/auth', authRouter)

mainRouter.use('/home', authMiddlware, (req, res, next) => {
  if (!(req.user && req.user.username)) return res.redirect('/signin')
  return next()
})
const dir = path.join(path.resolve(), 'client')
mainRouter.use('/home', express.static(dir))

mainRouter.use('/api/v1', authMiddlware, apiRouter)

// should be the last route for fallback
mainRouter.get('*', (req, res) => {
  res.redirect('/home')
})

export default mainRouter
