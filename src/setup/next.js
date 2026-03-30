const chalk = require('chalk');
const { createDirectory, createFile, readTemplate } = require('../utils/fileUtils');
const { runCommandsSequentially } = require('../utils/terminalUtils');
const path = require('path');

async function setupNext(projectPath, projectName, projectParentPath, features, database) {
    console.log(chalk.green('Creating Next.js project structure...'));
    
    let nextCmd = `npx create-next-app@latest "${projectName}"`;
    if (features.includes('Tailwind CSS')) {
        nextCmd += ' --tailwind';
    } else {
        nextCmd += ' --tailwind=false';
    }

    nextCmd += ' --ts --eslint --app=true --src-dir=false --import-alias="@/*" --use-npm --yes';

    console.log(chalk.yellow('Running Next.js setup... This may take a few minutes.'));
    
    // Database Setup
    let dbDeps = [];
    let dbInitCommands = [];
    let dbEnvContent = '';

    if (database !== 'None') {
        const dbType = database.toLowerCase();
        const dbTemplate = readTemplate(path.join(__dirname, '..', 'templates', 'database', dbType, 'db.js'));
        dbEnvContent = readTemplate(path.join(__dirname, '..', 'templates', 'database', dbType, 'env.txt'));

        if (database === 'MongoDB') dbDeps.push('mongoose');
        else if (database === 'PostgreSQL') dbDeps.push('pg');
        else if (database === 'MySQL') dbDeps.push('mysql2');

        dbInitCommands.push(`mkdir lib -ea 0`);
        // We will create the file after the app is generated
    }

    const commands = [
        nextCmd,
        `cd "${projectName}"`,
        `mkdir components -ea 0`, 
        `mkdir public -ea 0`
    ];

    if (dbDeps.length > 0) {
        commands.push(`npm install ${dbDeps.join(' ')}`);
        commands.push(`mkdir lib -ea 0`);
    }

    runCommandsSequentially(commands, projectParentPath, `DevInit: ${projectName}`);

    // Post-creation file operations
    if (database !== 'None') {
        const dbType = database.toLowerCase();
        const dbTemplate = readTemplate(path.join(__dirname, '..', 'templates', 'database', dbType, 'db.js'));
        createDirectory(path.join(projectPath, 'lib'));
        createFile(path.join(projectPath, 'lib', 'db.js'), dbTemplate);
        
        if (dbEnvContent) {
            createFile(path.join(projectPath, '.env.local'), dbEnvContent);
        }
    }
}

module.exports = { setupNext };
