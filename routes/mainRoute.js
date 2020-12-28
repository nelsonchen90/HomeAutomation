import express from 'express'
import path from 'path'
import jwtMid from 'express-jwt'
import apiRouter from './api/apiMainRoute.js'
import { authRouter } from './api/userOperations.js'
import { adapter as usbSwitchSkillAdaptor } from '../alexa/skills/usbSwitch/usbSwitchSkill.js'

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
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
  getToken: (req) => {
    const tokenString = (req.headers && req.headers.authorization) ||
      (req.cookies && req.cookies.access_token) || (req.query && req.query.access_token)
    if (tokenString && tokenString.split(' ')[0] === 'Bearer') {
      return tokenString.split(' ')[1]
    }
    return null
  }
})

const publicDir = path.join(path.resolve(), 'public')
mainRouter.use('/signin', express.static(publicDir))
mainRouter.use('/auth', authRouter)
mainRouter.get('/logout', (req, res) => {
  res.clearCookie('access_token')
  res.redirect('/')
})

mainRouter.use('/home', authMiddlware)
mainRouter.use('/home', (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(403).redirect('/logout')
  } else {
    next()
  }
})
mainRouter.use('/home', (req, res, next) => {
  if (!(req.user && req.user.username)) return res.redirect('/signin')
  return next()
})
const dir = path.join(path.resolve(), 'client')
mainRouter.use('/home', express.static(dir))

mainRouter.use('/api/v1', authMiddlware)
mainRouter.use('/api/v1', (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(403).json({
      errorCode: 'authentication/invalid_token',
      errorMessage: err.message
    })
  } else {
    next()
  }
})
mainRouter.use('/api/v1', apiRouter)

mainRouter.use('/alexa', usbSwitchSkillAdaptor.getRequestHandlers())

// should be the last route for fallback
mainRouter.get('*', (req, res) => {
  res.redirect('/home')
})

export default mainRouter
