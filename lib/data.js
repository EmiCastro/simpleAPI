/**
 * Library for apply CRUD methods on data.
 */

 // Dependencies
 const fs = require('fs')
 const path = require('path')
 const { promisify } = require('util')

 // Container for the module
 const lib = {}

// Define the base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/')

// Write data to a file
lib.create = (dir, file, data, cb) => {
    const openFile = promisify(fs.open)
    const writeFile = promisify(fs.write)
    const closeFile = promisify(fs.close)
    // Open the file for writing
    openFile(buildPath(lib.baseDir, dir, file), 'wx')
        .then((fileDescriptor) => {
            // Convert data to string
            const stringData = JSON.stringify(data)

            // Write to file and close it
            writeFile(fileDescriptor, stringData)
                .then(() => closeFile(fileDescriptor)
                    .then(() => cb(false))
                    .catch(() => cb('Error closing this file.')))
                .catch(() => cb('Error writing to new file.'))
        })
        .catch(() => cb('Could not create a file, it may already exists.'))
}

// Read data from a file
lib.read = (dir, file, cb) => {
    const readFile = promisify(fs.readFile)
    readFile(buildPath(lib.baseDir, dir, file), 'utf8', (err, data) => cb(err, data))
}

// Update data inside a file
lib.update = (dir, file, data, cb) => {
    const openFile = promisify(fs.open)
    const writeFile = promisify(fs.write)
    const closeFile = promisify(fs.close)
    // Open the file for writing
    openFile(buildPath(lib.baseDir, dir, file), 'r+')
        .then((fileDescriptor) => {
            // Convert data to string
            const stringData = JSON.stringify(data)

            // Truncate the file
            const truncFile = promisify(fs.ftruncate)
            truncFile(fileDescriptor)
                .then(() => {
                    // Write to file and close it
                    writeFile(fileDescriptor, stringData)
                        .then(() => closeFile(fileDescriptor)
                            .then(() => cb(false))
                            .catch(() => cb('Error closing this file.')))
                        .catch(() => cb('Error writing to existing file.'))
                })
                .catch(() => cb('Error truncating the file.'))
        })
        .catch(() => cb('Could not open the file for updating. It may not exists yet.'))
}

// Delete a file
lib.delete = (dir, file, cb) => {
    // Unlink
    const unlinkFile = promisify(fs.unlink)
    unlinkFile(buildPath(lib.baseDir, dir, file))
        .then(() => cb(false))
        .catch(() => cb('Error deleting file.'))
}

function buildPath(base, dir, file) {
    return path.join(base, dir, `${file}.json`)
}

 // Export module
 module.exports = lib