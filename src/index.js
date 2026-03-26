#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const { setupMern } = require('./setup/mern.js');
const { setupMean } = require('./setup/mean.js');
const { setupNext } = require('./setup/next.js');

async function main() {
    console.log(chalk.bold.blue('Welcome to DevInit (Next-Gen Stack Setup Assistant)!'));

    try {
        // 1. Interactive Stack Selection
        const { stackChoice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'stackChoice',
                message: 'Select the stack you want to set up:',
                choices: ['MERN Stack', 'MEAN Stack', 'Next.js App']
            }
        ]);

        const features = [];

        // 3. Project Name
        const { projectName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter the project name:',
                default: 'my-awesome-project',
                validate: (input) => input.trim().length > 0 ? true : 'Project name cannot be empty'
            }
        ]);

        // 4. Project folder
        const projectParentPath = process.cwd();
        const projectPath = path.join(projectParentPath, projectName);

        // Confirmation Prompts
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Ready to create ${stackChoice} project "${projectName}" at ${projectPath}?`,
                default: true
            }
        ]);

        if (!confirm) {
            console.log(chalk.yellow('Setup cancelled.'));
            return;
        }

        console.log(chalk.green(`\nStarting ${stackChoice} setup...`));

        switch (stackChoice) {
            case 'MERN Stack':
                await setupMern(projectPath, projectName, features);
                break;
            case 'MEAN Stack':
                await setupMean(projectPath, projectName, features);
                break;
            case 'Next.js App':
                await setupNext(projectPath, projectName, projectParentPath, features);
                break;
        }

    } catch (error) {
        console.error(chalk.red(`Setup failed: ${error.message}`));
    }
}

main();
