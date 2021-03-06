"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const logger_1 = require("./logger");
const initWorkspaceByGit_1 = require("./initWorkspaceByGit");
const utils_1 = require("./utils");
function activate() {
    const workspaceFolder = { uri: { path: utils_1.getWorkspaceRootPath() } };
    const rootPath = workspaceFolder.uri.path;
    logger_1.logger.appendLine(`rootPath: ${rootPath}`);
    if (rootPath === undefined) {
        logger_1.logger.appendLine("rootpath is undefined");
        return;
    }
    logger_1.logger.appendLine("user: " + process.getuid() + " group: " + process.getgid());
    logger_1.logger.appendLine(`env: ${process.env}`);
    // 修改全局的用户设置
    vscode.workspace.getConfiguration("files", null).update("eol", "\n", vscode.ConfigurationTarget.Global);
    const initByGit = new initWorkspaceByGit_1.default();
    initByGit.initWorkspace(rootPath).then(b => {
        if (b) {
            utils_1.launchPreviewDerectionYml(10);
        }
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map