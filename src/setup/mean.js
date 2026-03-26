const chalk = require('chalk');
const path = require('path');
const { createDirectory, createFile } = require('../utils/fileUtils');
const { runCommandsSequentially } = require('../utils/terminalUtils');

async function setupMean(projectPath, projectName, features) {
    console.log(chalk.green('Creating MEAN project structure...'));
    
    // Create Root
    createDirectory(projectPath);

    // Create Server Folders
    const serverPath = path.join(projectPath, 'server');
    const folders = ['controllers', 'models', 'routes'];
    folders.forEach(folder => createDirectory(path.join(serverPath, folder)));

    // Server files
    const indexJsContent = `
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MEAN Server is running');
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});
`;
    createFile(path.join(serverPath, 'index.js'), indexJsContent);
    createFile(path.join(serverPath, '.env'), 'PORT=5000\nMONGO_URI=your_mongodb_connection_string');
    
    // README
    const readmeContent = `
# ${projectName}

## MEAN Stack Project
- Client: Angular
- Server: Express, Node.js, MongoDB

## Setup
cd server
npm install
npm run dev

cd ../client
ng serve
`;
    createFile(path.join(projectPath, 'README.md'), readmeContent);

    // Automation
    console.log(chalk.yellow('Installing dependencies and setting up Angular client...'));
    
    const commands = [
        'mkdir server -ea 0',
        'cd server',
        'npm init -y',
        'npm install express mongoose cors dotenv',
        'cd ..',
        'npx @angular/cli new client --defaults'
    ];

    runCommandsSequentially(commands, projectPath, `DevInit: ${projectName}`);
}

module.exports = { setupMean };
