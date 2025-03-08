const { Blog } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Session = require('../models/sessions')


const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    next()
  }
  
  const errorHandler = async (error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' })
  }
  

  const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        const token = authorization.substring(7)
        req.token = token
        req.decodedToken = jwt.verify(token, SECRET)
        const session = await Session.findOne({ where: { token } })
        if (!session) {
          return res.status(401).json({ error: 'token expired' })
        }
      } catch (error) {
        return res.status(401).json({ error: 'token invalid' })
      }
    } else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

  module.exports = {
    blogFinder,
    errorHandler,
    tokenExtractor
  }