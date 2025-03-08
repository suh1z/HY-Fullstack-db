const router = require('express').Router()
const { Blog } = require('../models')
const { fn, col, literal } = require('sequelize')

router.get('/', async (req, res) => {
    try {
        const authors = await Blog.findAll({
            attributes: [
                'author',
                [fn('COUNT', col('author')), 'blogs'],
                [fn('SUM', col('likes')), 'likes']
            ],
            group: ['author'],
            order: [[literal('likes'), 'DESC']]
        })
        res.json(authors)

    } catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = router