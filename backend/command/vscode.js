// const vscode = require('vscode');
// function activate(context) {
//   vscode.window.createTerminal({ name: 'Dev App', shellPath: 'npm', shellArgs: ['run', 'dev', '--', '--host', '0.0.0.0'] });
// }
// exports.activate = activate;

import * as vscode from 'vscode';

export function activate(context) {
    // Watch all terminal outputs for the dev server message
    vscode.window.onDidWriteTerminalData(e => {
        if (/localhost:\d{4,5}/.test(e.data)) {
            // extract the port
            const match = e.data.match(/localhost:(\d{4,5})/);
            if (match) {
                const url = `http://localhost:${match[1]}`;
                vscode.commands.executeCommand('simpleBrowser.show', url);
            }
        }
    });
}


