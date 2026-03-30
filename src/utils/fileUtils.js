const fs = require('fs');

function createDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function createFile(filePath, content) {
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
}

function appendToFile(filePath, content) {
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, '\n' + content.trim() + '\n', 'utf-8');
    } else {
        createFile(filePath, content);
    }
}

function readTemplate(templatePath) {
    if (fs.existsSync(templatePath)) {
        return fs.readFileSync(templatePath, 'utf-8');
    }
    return '';
}

module.exports = { createDirectory, createFile, appendToFile, readTemplate };
