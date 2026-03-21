"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNext = setupNext;
const vscode = require("vscode");
const terminalUtils_1 = require("../utils/terminalUtils");
async function setupNext(projectPath, projectName, projectParentPath, features) {
    vscode.window.showInformationMessage('Creating Next.js project structure...');
    // We execute create-next-app from the parent path with the project name
    const readmeContent = `
# ${projectName}

## Next.js App
`;
    // We wait out before making folders, because create-next-app complains if directory is not empty?
    // User requested specific directory structure, but let's conform to standard behavior unless we strictly need it.
    // Next.js actually handles the \`components\`, \`pages\`/\`app\` internally if prompted or just creates standard folders.
    // If the folder already exists, create-next-app might fail.
    // To be safe, we let npx create-next-app run first by creating the base. 
    // Wait, since we need to show the prompt and do it non-interactively, we pass the flags.
    let nextCmd = `npx create-next-app@latest "${projectName}"`;
    if (features.includes('Tailwind CSS')) {
        nextCmd += ' --tailwind';
    }
    else {
        nextCmd += ' --tailwind=false';
    }
    nextCmd += ' --ts --eslint --app=true --src-dir=false --import-alias="@/*" --use-npm --yes';
    vscode.window.showInformationMessage('Running Next.js setup... This may take a few minutes.');
    // Since the directory might not exist yet, we run the command from the parent path
    const commands = [
        nextCmd,
        `cd "${projectName}"`,
        // We will create the components and public folder as user requested after Next init simply via terminal
        `mkdir components -ea 0`,
        `mkdir public -ea 0`
    ];
    (0, terminalUtils_1.runCommandsSequentially)(commands, projectParentPath, `DevInit: ${projectName}`);
}
//# sourceMappingURL=next.js.map