const Blog = require('./blog')
const Readings = require('./readings')
const User = require('./user')
const Session = require('./sessions')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readings, as: 'readingsList' })
Blog.belongsToMany(User, { through: Readings, as: 'listReadings' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = { Blog, User, Readings, Session }