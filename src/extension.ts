import * as vscode from 'vscode';
import { setupMern } from './setup/mern';
import { setupMean } from './setup/mean';
import { setupNext } from './setup/next';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('devinit.startSetup', async () => {
        try {
            // 1. Interactive Stack Selection
            const stackChoice = await vscode.window.showQuickPick(
                ['MERN Stack', 'MEAN Stack', 'Next.js App'],
                { placeHolder: 'Select the stack you want to set up' }
            );

            if (!stackChoice) {
                return;
            }

            // Optional Feature Selection
            const features = await vscode.window.showQuickPick(
                ['Tailwind CSS', 'Authentication (JWT)', 'Docker Setup'],
                { placeHolder: 'Select additional optional features (Press Enter to skip)', canPickMany: true }
            );

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
            const confirm = await vscode.window.showInformationMessage(
                `Ready to create ${stackChoice} project "${projectName}" at ${projectPath}?`,
                'Yes', 'Cancel'
            );

            if (confirm !== 'Yes') {
                return;
            }

            vscode.window.showInformationMessage(`Starting ${stackChoice} setup...`);

            // 4. Trigger Setup Modules
            switch (stackChoice) {
                case 'MERN Stack':
                    await setupMern(projectPath, projectName, features || []);
                    break;
                case 'MEAN Stack':
                    await setupMean(projectPath, projectName, features || []);
                    break;
                case 'Next.js App':
                    await setupNext(projectPath, projectName, projectParentPath, features || []);
                    break;
            }

        } catch (error: any) {
            vscode.window.showErrorMessage(`Setup failed: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
