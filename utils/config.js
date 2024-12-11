/**
 * Handling of env variables now seperated into the config.js
 * file. 
 * 
 * Other parts of the app now access the env vars
 * by importing the configuration module:
 * 
 * const config = require('./utils/config')
 * logger.info('Server running on port ${config.PORT})
 */

require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}