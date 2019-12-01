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
lib.create = (dir, file, data) => {
    const openFile = promisify(fs.open)
    const writeFile = promisify(fs.write)
    const closeFile = promisify(fs.close)
    // Open the file for writing
    openFile(path.join(lib.baseDir, dir, `${file}.json`), 'wx')
        .then((fileDescriptor) => {
            // Convert data to string
            const stringData = JSON.stringify(data)

            // Write to file and close it
            writeFile(fileDescriptor, stringData)
                .then(() => closeFile(fileDescriptor)
                    .then(() => console.log('Succes!'))
                    .catch((error) => console.log('Error closing this file.')))
                .catch((error) => console.log('Error writing to new file.'))})
        .catch(error => console.log('Could not create a file, it may already exists.'))
}

 // Export module
 module.exports = lib