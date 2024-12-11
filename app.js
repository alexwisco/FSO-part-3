/**
 * Defining application logic
 * 
 * A lot moved over from index.js
 * 
 * Database connection
 */

// Access env variables
const config = require('./utils/config')

// specify name of module 'express'
const express = require('express')

// create express application using module
app = express()

// provide connect/express middleware
const cors = require('cors')

// Access router object defined in controllers/notes.js
const notesRouter = require('./controllers/notes')

//
const middleware = require('./utils/middleware')

//
const logger = require('./utils/logger')

// moved over from models/note.js
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// DB connection logging
logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB :)')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB :(',
            error.message)
    })

// applying imported functionality for the app
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/notes', notesRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app