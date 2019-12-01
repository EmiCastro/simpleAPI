// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = (data, cb) =>
  // Callback a http status code, and a payload object
  cb(200, {'name' : 'ping'})

// Not found handler
handlers.notFound = (data, cb) => cb(404)

module.exports = handlers