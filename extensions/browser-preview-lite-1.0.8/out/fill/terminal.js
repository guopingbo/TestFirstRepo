"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode = require("vscode");
const utils_1 = require("../utils");
class TerminalManager {
    constructor() { }
    createTerminal(rootPath = "") {
        const cwd = utils_1.getWorkspaceRootPath() + rootPath;
        if (!fs.existsSync(cwd)) {
            vscode.window.showErrorMessage(`项目 root 路径: ${cwd} 不存在，请检查配置是否正确`);
            return;
        }
        return vscode.window.createTerminal({
            name: TerminalManager.TERMINALNAME,
            cwd: utils_1.getWorkspaceRootPath() + rootPath,
        });
    }
    activePreviewTerminal(rootPath = "") {
        rootPath = "/" + rootPath.replace(/^(.?)\//g, "");
        const terminal = this.createTerminal(rootPath);
        if (!terminal)
            return this;
        this.currentTerminal = terminal;
        this.currentTerminal.show();
        return this;
    }
    commands(str) {
        if (!this.currentTerminal)
            return this;
        this.currentTerminal.sendText(str);
        return this;
    }
}
TerminalManager.TERMINALNAME = utils_1.extensionName;
exports.default = TerminalManager;

//# sourceMappingURL=terminal.js.map
