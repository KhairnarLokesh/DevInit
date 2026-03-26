const chalk = require('chalk');
const { runCommandsSequentially } = require('../utils/terminalUtils');

async function setupNext(projectPath, projectName, projectParentPath, features) {
    console.log(chalk.green('Creating Next.js project structure...'));
    
    let nextCmd = `npx create-next-app@latest "${projectName}"`;
    if (features.includes('Tailwind CSS')) {
        nextCmd += ' --tailwind';
    } else {
        nextCmd += ' --tailwind=false';
    }

    nextCmd += ' --ts --eslint --app=true --src-dir=false --import-alias="@/*" --use-npm --yes';

    console.log(chalk.yellow('Running Next.js setup... This may take a few minutes.'));
    
    const commands = [
        nextCmd,
        `cd "${projectName}"`,
        `mkdir components -ea 0`, 
        `mkdir public -ea 0`
    ];

    runCommandsSequentially(commands, projectParentPath, `DevInit: ${projectName}`);
}

module.exports = { setupNext };
