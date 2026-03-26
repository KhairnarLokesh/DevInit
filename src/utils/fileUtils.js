const fs = require('fs');

function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function createFile(filePath, content) {
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
}

module.exports = { createDirectory, createFile };
