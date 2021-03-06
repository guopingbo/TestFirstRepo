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
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const utils_1 = require("../utils");
const tmpTempContent = `
# .vscode/preview.yml
autoOpen: true # 打开工作空间时是否自动开启所有应用的预览
apps:
  - port: 3000 # 应用的端口
    run: yarn start # 应用的启动命令
    root: ./app # 应用的启动目录
    name: my-first-app # 应用名称
    description: 我的第一个 App。 # 应用描述
    autoOpen: true # 打开工作空间时是否自动开启预览（优先级高于根级 autoOpen）
`;
class YmlTemplate {
    constructor() {
        this.workspacePath = utils_1.getWorkspaceRootPath();
    }
    get vscodeDir() {
        return path.join(this.workspacePath, ".vscode");
    }
    get ymlFile() {
        return path.join(this.vscodeDir, YmlTemplate.ymlFileName);
    }
    isHasYamlTemplate() {
        if (!this.workspacePath)
            return Promise.resolve(false);
        return Promise.resolve(fs.existsSync(this.ymlFile));
    }
    getYmlContent(isShowError = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => {
                try {
                    res(yaml.safeLoad(fs.readFileSync(this.ymlFile, "utf8")));
                }
                catch (error) {
                    if (isShowError)
                        vscode.window.showErrorMessage(`${YmlTemplate.ymlFileName} 文件格式错误`);
                    res();
                }
            });
        });
    }
    generateYmlTemp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isHasYamlTemplate())) {
                if (!fs.existsSync(this.vscodeDir))
                    fs.mkdirSync(this.vscodeDir, { recursive: true });
                fs.writeFileSync(this.ymlFile, tmpTempContent, { encoding: "utf-8" });
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
    }
    getYmlAutoOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlContent = yield this.getYmlContent();
            return Promise.resolve(ymlContent ? ymlContent.autoOpen : false);
        });
    }
    getYmlApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlContent = yield this.getYmlContent();
            return Promise.resolve(ymlContent ? ymlContent.apps : []);
        });
    }
    openYmlFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const openTextDoc = yield vscode.workspace.openTextDocument(vscode.Uri.file(this.ymlFile));
            return yield vscode.window.showTextDocument(openTextDoc);
        });
    }
}
YmlTemplate.ymlFileName = "preview.yml";
exports.default = YmlTemplate;

//# sourceMappingURL=ymlTemplate.js.map
