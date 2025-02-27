const { Blog } = require('../models')
const logger = require('../util/logger.js')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    next()
  }
  
  const errorHandler = (error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' })
  }
  

  module.exports = {
    blogFinder,
    errorHandler
  }