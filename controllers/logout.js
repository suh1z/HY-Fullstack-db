const router = require('express').Router()
const Session = require('../models/sessions')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
    const token = req.token
    await Session.destroy({ where: { token } })
    res.status(200).json({ message: 'Logged out successfully' })
    })

module.exports = router