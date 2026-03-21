"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const mern_1 = require("./setup/mern");
const mean_1 = require("./setup/mean");
const next_1 = require("./setup/next");
function activate(context) {
    let disposable = vscode.commands.registerCommand('devinit.startSetup', async () => {
        try {
            // 1. Interactive Stack Selection
            const stackChoice = await vscode.window.showQuickPick(['MERN Stack', 'MEAN Stack', 'Next.js App'], { placeHolder: 'Select the stack you want to set up' });
            if (!stackChoice) {
                return;
            }
            // Optional Feature Selection
            const features = await vscode.window.showQuickPick(['Tailwind CSS', 'Authentication (JWT)', 'Docker Setup'], { placeHolder: 'Select additional optional features (Press Enter to skip)', canPickMany: true });
            // 2. Project Setup Input - Name
            const projectName = await vscode.window.showInputBox({
                prompt: 'Enter the project name',
                placeHolder: 'my-awesome-project',
                validateInput: text => text && text.trim().length > 0 ? null : 'Project name cannot be empty'
            });
            if (!projectName) {
                return;
            }
            // 3. Project Setup Input - Location
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Project Location'
            });
            if (!folderUri || folderUri.length === 0) {
                return;
            }
            const projectParentPath = folderUri[0].fsPath;
            const projectPath = vscode.Uri.joinPath(folderUri[0], projectName).fsPath;
            // Confirmation Prompts
            const confirm = await vscode.window.showInformationMessage(`Ready to create ${stackChoice} project "${projectName}" at ${projectPath}?`, 'Yes', 'Cancel');
            if (confirm !== 'Yes') {
                return;
            }
            vscode.window.showInformationMessage(`Starting ${stackChoice} setup...`);
            // 4. Trigger Setup Modules
            switch (stackChoice) {
                case 'MERN Stack':
                    await (0, mern_1.setupMern)(projectPath, projectName, features || []);
                    break;
                case 'MEAN Stack':
                    await (0, mean_1.setupMean)(projectPath, projectName, features || []);
                    break;
                case 'Next.js App':
                    await (0, next_1.setupNext)(projectPath, projectName, projectParentPath, features || []);
                    break;
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Setup failed: ${error.message}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map