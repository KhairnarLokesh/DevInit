"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommandsSequentially = runCommandsSequentially;
const vscode = require("vscode");
function runCommandsSequentially(commands, cwd, name = 'DevInit Setup') {
    const terminal = vscode.window.createTerminal({ name, cwd });
    terminal.show();
    for (const cmd of commands) {
        terminal.sendText(cmd);
    }
}
//# sourceMappingURL=terminalUtils.js.map