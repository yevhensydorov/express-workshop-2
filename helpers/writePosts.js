const fs = require('fs');

const save = function(filePath, data, callback) {
    fs.writeFile(filePath, data, function(error){
        if (error) {
            callback(error);
        } else {
            callback();
        }
    });
};

module.exports = writePosts;
