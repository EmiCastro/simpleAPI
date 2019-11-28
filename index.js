/*
 * Primary file of the API
 *
 */

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) =>
  unifiedServer(req, res))

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort}`)
})

// Set HTTPS server options
const httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

// Instantiate the HTTPS server
const httpsServer = https.createServer(httpsServerOptions, 
  (req, res) => unifiedServer(req, res))

// Stat the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort}`)
})

// 

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true)

  // Get the path
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedURL.query

  // Get the headers as an object
  const headers = req.headers

  // Get the http method
  const method = req.method.toLowerCase()

  // Get the user payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })
  req.on('end', () => {
    buffer += decoder.end()

    // Choose the handler this request should go to. If it doesn't exists, send it to notFound handler.
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to an 200.
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200

      // Use the payload called back by the hanlder, or default to an empty object
      payload = typeof(payload) === 'object' ? payload : {}

      // Convert the payload to an string
      let payloadString = JSON.stringify(payload)

      // Return the response
      res.setHeader('Content-Type', 'aplication/json')
      res.writeHead(statusCode)
      res.end(payloadString)

      // Log
      console.log('Returning this response:', statusCode, payload)

    })
  })
}

// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = (data, cb) => {
  // Callback a http status code, and a payload object
  cb(200, {'name' : 'ping'})
}

// Not found handler
handlers.notFound = (data, cb) => {
  cb(404)
}

// Define a request router
const router = {
  'ping': handlers.ping
}