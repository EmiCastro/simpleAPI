/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto')
const config = require('../config')

// Container for helpers
const helpers = {}

// Create a SHA256 hash
helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    } else {
        return false;
    }
}

// Export the container
module.exports = helpers