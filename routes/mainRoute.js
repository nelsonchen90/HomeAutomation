import express from 'express'
import path from 'path'
import apiRouter from './api/apiMainRoute.js'

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

const dir = path.join(path.resolve(), 'client')
console.log(dir)

mainRouter.use('/', express.static(dir))

mainRouter.use('/api/v1', apiRouter)

// should be the last route for fallback
mainRouter.get('*', (req, res) => {
  res.redirect('/')
})

export default mainRouter
