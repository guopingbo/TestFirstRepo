"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const os = require("os");
const fs = require("fs");
const path = require("path");
exports.cloudstudiorc = ".cloudstudiorc";
exports.cloudstudiorcPath = path.join(os.homedir(), exports.cloudstudiorc);
exports.isExistCloudstudiorc = () => {
    return fs.existsSync(exports.cloudstudiorcPath);
};
exports.showErrorMessageUnAuthorization = () => {
    vscode.window.showErrorMessage(`${exports.extensionName} 插件无法获取授权, 请刷新重试.`);
};
exports.extensionName = "Browser Preview Lite";
exports.debugTypeName = "browser-preview-lite";
exports.readCloudstudiorc = () => __awaiter(this, void 0, void 0, function* () {
    return new Promise(result => {
        fs.readFile(exports.cloudstudiorcPath, "utf8", (err, data) => {
            if (err) {
                exports.showErrorMessageUnAuthorization();
                return;
            }
            result(data);
        });
    });
});
exports.sleep = (time) => __awaiter(this, void 0, void 0, function* () {
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, time);
    });
});
exports.extractNumber = (str) => {
    return parseInt(str.replace(/[^0-9]+/g, ""));
};
exports.getWorkspaceRootPath = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.path : "";
};

//# sourceMappingURL=utils.js.map
