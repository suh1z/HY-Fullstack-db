const router = require('express').Router()
const { Blog } = require('../models')
const blogFinder = require('../util/middleware').blogFinder

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs))
    res.json(blogs)
})

router.post('/', async (req, res) => {
    const { title, url, author } = req.body;
    const newBlog = await Blog.create({
        title,
        url,
        author,
    });
    res.status(201).json(newBlog);
})

router.delete('/:id', blogFinder, async (req, res) => {
    await req.blog.destroy()
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
    const { likes } = req.body;
    req.blog.likes = likes;
    await req.blog.save();
    res.json(req.blog)
})

module.exports = router