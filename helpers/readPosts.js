const fs = require('fs');

const readPosts = (filePath, callback) => {
    fs.readFile(filePath, (error, file) => {
        callback(error, file.toString());
    });
}
module.exports = readPosts;

