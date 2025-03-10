require('dotenv').config()
require('express-async-errors')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')
const middleware = require('./util/middleware')
const express = require('express')
const app = express()

app.use(express.json())
app.use(middleware.errorHandler)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()