/**
 * Self implemented middleware moved here
 */

const logger = require('./logger')
 
// Middleware: functions that are used to process req/res objects.
// Should be enabled before the applications routes.
// copied from index.js
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}


/**
 * error handler function
 * Express error handlers are middleware whose defining function has four params.
 * @param {*} error 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns Error message and status code
 */
const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}