const router = require('express').Router()
const { Blog, User, Readings } = require('../models')
const tokenExtractor = require('../util/middleware').tokenExtractor

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.body.blog_id)

    if (!blog) {
      return res.status(404).json({ error: 'Not found' })
    }

    const reading = await Readings.create({
      userId: user.id,
      blogId: blog.id,
      read: false 
    })

    res.status(201).json({
      message: 'Blog added to reading list',
      reading
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: error.message })
  }
})


router.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const reading = await Readings.findByPk(req.params.id)
    if (!reading) {
      return res.status(404).json({ error: 'Not found' })
    }
    const user = await User.findByPk(req.decodedToken.id)
    if (reading.userId !== user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    reading.read = req.body.read
    await reading.save()
    res.status(200).json(reading)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router