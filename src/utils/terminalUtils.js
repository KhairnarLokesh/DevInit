const { spawnSync } = require('child_process');
const chalk = require('chalk');
const path = require('path');

function runCommandsSequentially(commands, initialCwd, name = 'DevInit Setup') {
    let currentCwd = initialCwd;
    console.log(chalk.cyan(`\nStarting: ${name}`));
    for (const cmd of commands) {
        if (cmd.startsWith('cd ')) {
            const dest = cmd.split(' ')[1].replace(/["']/g, ''); // simple parsing
            currentCwd = path.resolve(currentCwd, dest);
            console.log(chalk.blue(`> Changed directory to: ${currentCwd}`));
            continue;
        }

        console.log(chalk.gray(`> Executing: ${cmd}`));
        let executeCmd = cmd;
        if (process.platform === 'win32' && cmd.includes('-ea 0')) {
            executeCmd = cmd.replace('-ea 0', '').trim(); // cmd doesn't support ErrorAction
        }

        const result = spawnSync(executeCmd, { 
            cwd: currentCwd, 
            shell: true, 
            stdio: 'inherit' 
        });

        if (result.error) {
            console.error(chalk.red(`Failed to start command: ${executeCmd}`));
            console.error(result.error);
        } else if (result.status !== 0) {
            console.error(chalk.yellow(`Command exited with code ${result.status} (this might not be fatal): ${executeCmd}`));
        }
    }
    console.log(chalk.green(`\nFinished: ${name}`));
}

module.exports = { runCommandsSequentially };
