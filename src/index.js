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
        // 1. Project Name
        const { projectName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter the project name:',
                default: 'my-awesome-project',
                validate: (input) => {
                    const validStr = input.trim();
                    if (validStr.length === 0) return 'Project name cannot be empty';
                    if (!/^[a-z0-9-_]+$/.test(validStr)) return 'Project name can only contain lowercase letters, numbers, dashes, and underscores';
                    return true;
                }
            }
        ]);

        // 2. Setup Mode
        const { setupMode } = await inquirer.prompt([
            {
                type: 'list',
                name: 'setupMode',
                message: 'Select setup mode:',
                choices: ['Quick Setup (Beginner)', 'Custom Setup (Advanced)']
            }
        ]);

        // 3. Technology Stack
        const { stackChoice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'stackChoice',
                message: 'Select the stack you want to set up:',
                choices: ['MERN Stack', 'MEAN Stack']
            }
        ]);

        let frontendOption = '';
        let language = 'JavaScript';
        let styling = 'Plain CSS';
        let features = [];
        let pkgManager = 'npm';

        if (setupMode === 'Quick Setup (Beginner)') {
            frontendOption = (stackChoice === 'MERN Stack') ? 'Vite' : 'Angular CLI';
            language = 'JavaScript';
            styling = 'Plain CSS';
            features = [];
            pkgManager = 'npm';
        } else {
            // Custom Setup mode
            // 4. Frontend Option
            if (stackChoice === 'MERN Stack') {
                const { fe } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'fe',
                        message: 'Select frontend tool:',
                        choices: ['Vite', 'Next.js', 'Create React App (Legacy)']
                    }
                ]);
                frontendOption = fe;
            } else {
                frontendOption = 'Angular CLI';
            }

            // 5. Package Manager
            const { pm } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'pm',
                    message: 'Select preferred package manager:',
                    choices: ['npm', 'yarn', 'pnpm']
                }
            ]);
            pkgManager = pm;
        }

        const projectParentPath = process.cwd();
        const projectPath = path.join(projectParentPath, projectName);

        // Confirmation Prompt
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
        console.log(chalk.cyan(`Options: Frontend=${frontendOption}, Lang=${language}, Style=${styling}, PM=${pkgManager}`));

        // Initialize features array including chosen tech
        const finalFeatures = [...features];
        if (styling === 'Tailwind CSS') finalFeatures.push('Tailwind CSS');
        if (language === 'TypeScript') finalFeatures.push('TypeScript');

        // Route to the appropriate setup function based on user choices
        if (frontendOption === 'Next.js') {
            await setupNext(projectPath, projectName, projectParentPath, finalFeatures);
        } else if (stackChoice === 'MERN Stack') {
            // Pass the selected frontend option down to setupMern dynamically if needed
            finalFeatures.push(`Frontend:${frontendOption}`);
            finalFeatures.push(`PM:${pkgManager}`);
            await setupMern(projectPath, projectName, finalFeatures);
        } else if (stackChoice === 'MEAN Stack') {
            finalFeatures.push(`Frontend:${frontendOption}`);
            finalFeatures.push(`PM:${pkgManager}`);
            await setupMean(projectPath, projectName, finalFeatures);
        }

    } catch (error) {
        console.error(chalk.red(`Setup failed: ${error.message}`));
    }
}

main();
