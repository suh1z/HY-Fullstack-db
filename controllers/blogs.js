const express = require('express')
const router = express.Router()
const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
    const where = {}
    if (req.query.search) {
        where[Op.or] = [
            {
                title: {
                    [Op.substring]: req.query.search
                }
            },
            {
                author: {
                    [Op.substring]: req.query.search
                }
            }
        ]
    }
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [
        ['likes', 'DESC']]
    })
  
    res.json(blogs)
  })

router.post('/', tokenExtractor, async (req, res) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
      res.json(blog)
    } catch(error) {
      return res.status(400).json({ error: error.errors[0].message })
    }
  })

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog.userId !== user.id) {
        return res.status(403).json({ error: 'Not your Blog!' })
    }
    await req.blog.destroy()
    return res.status(200).json({ message: 'Deleted' }) 
})

router.put('/:id', blogFinder, async (req, res) => {
    const { likes } = req.body;
    req.blog.likes = likes;
    await req.blog.save();
    res.json(req.blog)
})

module.exports = router