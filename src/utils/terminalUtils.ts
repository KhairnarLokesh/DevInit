import * as vscode from 'vscode';

export function runCommandsSequentially(commands: string[], cwd: string, name: string = 'DevInit Setup') {
    const terminal = vscode.window.createTerminal({ name, cwd });
    terminal.show();
    for (const cmd of commands) {
        terminal.sendText(cmd);
    }
}
