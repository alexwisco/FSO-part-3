/**
 * Isolating all appliaction console output to new module 
 *  - logger.js
 */

/**
 * 
 * @param  {...any} params 
 * General log messages.
 */
const info = (...params) => {
    console.log(...params)
}

/**
 * 
 * @param  {...any} params 
 * Function for error situations.
 */
const error = (...params) => {
    console.error(...params)
}

/**
 * Exports an object that contains two functions as fields
 * 
 * Two ways to access ->
 * s
 * Use the entire object to be exported, referenced
 * in a file as const logger = require('./utils/logger)
 * 
 * OR: const { info, error } = require('./utils/logger)
 * Which allows me to drop the logger. and simply use
 * 'info('message') or 'error('error message') 
 */
module.exports = {
    info, error
}