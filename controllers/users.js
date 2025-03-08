const router = require('express').Router()
const { User, Blog } = require('../models')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [{
          model: Blog,
          attributes: { exclude: ['userId'] },
        }]
    })
    res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors[0].message })
      }
    else {
      return res.status(400).json({ error })
    }
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({username: req.params.username})
  if (user) {
    user.name = req.body.name;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req, res) => {
    const where = {}
    if (req.query.read) {
        const isRead = req.query.read === 'true'
        where.read = { [Op.eq]: isRead }
    }

    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['userId', 'created_at', 'updated_at', 'admin', 'disabled', 'id'] },
        include: [
            {
                model: Blog,
                as: 'readingsList',
                attributes: { exclude: ['userId', 'created_at', 'updated_at'] },
                through: {
                    attributes: ['id', 'read'],
                    where
                },
            },
        ]
    })
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router