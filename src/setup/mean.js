const chalk = require('chalk');
const path = require('path');
const { createDirectory, createFile, appendToFile, readTemplate } = require('../utils/fileUtils');
const { runCommandsSequentially } = require('../utils/terminalUtils');

async function setupMean(projectPath, projectName, features, database) {
    console.log(chalk.green('Creating MEAN project structure...'));
    
    // Create Root
    createDirectory(projectPath);

    // Create Server Folders
    const serverPath = path.join(projectPath, 'server');
    const folders = ['controllers', 'models', 'routes', 'config'];
    folders.forEach(folder => createDirectory(path.join(serverPath, folder)));

    // Database Setup
    let dbDeps = '';
    let dbInitCode = '';
    let dbEnvContent = '';

    if (database !== 'None') {
        process.stdout.write(chalk.cyan(`Configuring ${database}...\n`));
        const dbType = database.toLowerCase();
        const dbTemplate = readTemplate(path.join(__dirname, '..', 'templates', 'database', dbType, 'db.js'));
        dbEnvContent = readTemplate(path.join(__dirname, '..', 'templates', 'database', dbType, 'env.txt'));

        if (database === 'MongoDB') {
            dbDeps = 'mongoose';
            dbInitCode = "const connectDB = require('./config/db');\nconnectDB();";
        } else if (database === 'PostgreSQL') {
            dbDeps = 'pg';
            dbInitCode = "const pool = require('./config/db');";
        } else if (database === 'MySQL') {
            dbDeps = 'mysql2';
            dbInitCode = "const connection = require('./config/db');";
        }

        createFile(path.join(serverPath, 'config', 'db.js'), dbTemplate);
    }

    // Server files
    const indexJsContent = `
const express = require('express');
const cors = require('cors');
require('dotenv').config();

${dbInitCode}

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
    
    let envContent = 'PORT=5000';
    if (dbEnvContent) {
        envContent += '\n' + dbEnvContent;
    } else {
        envContent += '\nMONGO_URI=your_mongodb_connection_string';
    }
    createFile(path.join(serverPath, '.env'), envContent);
    
    // README
    const readmeContent = `
# ${projectName}

## MEAN Stack Project
- Client: Angular
- Server: Express, Node.js, ${database !== 'None' ? database : 'No Database'}

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
        `npm install express ${dbDeps} cors dotenv`,
        'cd ..',
        'npx @angular/cli new client --defaults'
    ];

    runCommandsSequentially(commands, projectPath, `DevInit: ${projectName}`);
}

module.exports = { setupMean };
