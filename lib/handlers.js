/**
 * Requests handlers
 */

// Dependencies
const _data = require('./data')
const helpers = require('./helpers')

// Define the handlers
const handlers = {};

// Users handlder
handlers.users = (data, cb) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete']
    if (acceptableMethods.includes(data.method)) {
        handlers._users[data.method](data, cb)
    } else {
        cb(405)
    }
}

// Container for the users submethods
handlers._users = {}

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
const { _users } = handlers
_users.post = (data, cb) => {
    // Check that all required fields are filled out
    const { payload } = data
    const firstName = typeof (payload.firstName) == 'string' && payload.firstName.trim().length > 0 ? payload.firstName.trim() : false
    const lastName = typeof (payload.lastName) == 'string' && payload.lastName.trim().length > 0 ? payload.lastName.trim() : false
    const phone = typeof (payload.phone) == 'string' && payload.phone.trim().length == 10 ? payload.phone.trim() : false
    const password = typeof (payload.password) == 'string' && payload.password.trim().length > 0 ? payload.password.trim() : false
    const tosAgreement = typeof (payload.tosAgreement) == 'boolean' && payload.tosAgreement == true ? true : false

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exists.
        _data.read('users', phone, (err, data) => {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password)

                // Create the user object
                const userObj = {
                    'firstName'         : firstName,
                    'lastName'          : lastName,
                    'phone'             : phone,
                    'hashedPassword'    : hashedPassword,
                    'tosAgreement'      : true
                }
                
            } else {
                // User already exists
                cb(400, { 'Error': `A user with number phone: ${phone} already exists.` })
            }
        })
    } else {
        cb(400, { 'Error': 'Missing required fields.' })
    }
}

// Users - get
_users.get = (data, cb) => {

}

// Users - put
_users.put = (data, cb) => {

}

// Users - delete
_users.delete = (data, cb) => {

}

// Ping handler
handlers.ping = (data, cb) => cb(200)

// Not found handler
handlers.notFound = (data, cb) => cb(404)

// Export the module
module.exports = handlers