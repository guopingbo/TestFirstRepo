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
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
class WebviewManager {
    constructor(context) {
        this.context = context;
        this.openWindowsMap = new Map();
    }
    getWebviewContent(url) {
        return `<!DOCTYPE html>
        <html lang="en" style="width: 100% !important;height: 100% !important; padding: 0; border: 0">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${utils_1.extensionName}</title>
        </head>
        <body style="width: 100%;height: 100%; border: none; padding: 0; margin: 0">
          <iframe src="${url}" sandbox="allow-scripts allow-forms allow-same-origin allow-popups" style="width: 100%;height: 100%; border: none; position: fixed"></iframe>
        </body>
        </html>`;
    }
    getContent(url) {
        try {
            const manifest = fs
                .readFileSync(path.join(this.context.extensionPath, "webviewDist", "asset-manifest.json"))
                .toString();
            const manifestFiles = JSON.parse(manifest).files;
            const mainScript = path.join(manifestFiles["main.js"]);
            const mainStyle = path.join(manifestFiles["main.css"]);
            const runtimeScript = path.join(manifestFiles["runtime~main.js"]);
            const chunkScriptsUri = [];
            for (let key in manifestFiles) {
                if (key.endsWith(".chunk.js") && manifestFiles.hasOwnProperty(key)) {
                    let chunkScriptUri = vscode.Uri.file(path.join(this.context.extensionPath, "webviewDist", manifestFiles[key])).with({
                        scheme: "vscode-resource",
                    });
                    chunkScriptsUri.push(chunkScriptUri);
                }
            }
            const runtimescriptPathOnDisk = vscode.Uri.file(path.join(this.context.extensionPath, "webviewDist", runtimeScript));
            const runtimescriptUri = runtimescriptPathOnDisk.with({
                scheme: "vscode-resource",
            });
            const mainScriptPathOnDisk = vscode.Uri.file(path.join(this.context.extensionPath, "webviewDist", mainScript));
            const mainScriptUri = mainScriptPathOnDisk.with({
                scheme: "vscode-resource",
            });
            const stylePathOnDisk = vscode.Uri.file(path.join(this.context.extensionPath, "webviewDist", mainStyle));
            const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });
            return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <link rel="stylesheet" type="text/css" href="${styleUri}">
                        <base href="${vscode.Uri.file(path.join(this.context.extensionPath, "webviewDist", "build")).with({ scheme: "vscode-resource" })}/">
                    </head>
                    <body>
                        <style>
                        .openInbrowser{
                            position: fixed;
                            top: 5px;
                            left: 0px;
                            cursor: pointer;
                            height: 29px;
                            width: 29px;
                            outline: 0;
                            color: #626262;
                            padding: 0 5px;
                            line-height: 38px;
                            text-align: center;
                            font-weight: bold;
                            font-size: 16px;
                            text-decoration:none;
                            background: url("data:image/svg+xml;utf8,%3Csvg%20t%3D%221559207389853%22%20class%3D%22icon%22%20style%3D%22%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221228%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2215%22%20height%3D%2215%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20d%3D%22M938.666667%20512a42.666667%2042.666667%200%200%200-42.666667%2042.666667v298.666666c0%2023.573333-19.093333%2042.666667-42.666667%2042.666667H170.666667c-23.573333%200-42.666667-19.093333-42.666667-42.666667V170.666667c0-23.573333%2019.093333-42.666667%2042.666667-42.666667h298.666666a42.666667%2042.666667%200%200%200%200-85.333333H170.666667C99.978667%2042.666667%2042.666667%2099.978667%2042.666667%20170.666667v682.666666c0%2070.688%2057.312%20128%20128%20128h682.666666c70.688%200%20128-57.312%20128-128V554.666667a42.666667%2042.666667%200%200%200-42.666666-42.666667z%20m42.666666-426.666667v256a42.666667%2042.666667%200%200%201-85.333333%200V188.330667l-349.557333%20349.546666a42.666667%2042.666667%200%200%201-60.32-60.330666L835.658667%20128H682.666667a42.666667%2042.666667%200%200%201%200-85.333333h256a42.666667%2042.666667%200%200%201%2042.666666%2042.666666z%22%20p-id%3D%221229%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E") no-repeat center;
                        }
                        </style>
                        <div id="root"></div>
                        <script src="${runtimescriptUri}"></script>
                        ${chunkScriptsUri.map(item => `<script src="${item}"></script>`)}
                        <script src="${mainScriptUri}"></script>
                        <a href="${url}" title="Open In Browser" class="openInbrowser"></a>
                        <iframe src="${url}" sandbox="allow-scripts allow-forms allow-same-origin allow-popups" style="width: 100%;height: 100%; border: none; position: fixed; background:#fff"></iframe>
                    </body>
                    </html>`;
        }
        catch (e) {
            console.log(e.message || "System Error");
        }
    }
    renderHTMLContent(url) {
        return this.getContent(url) || this.getWebviewContent(url);
    }
    create(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.openWindowsMap.get(url)) {
                this.openWindowsMap.forEach((panel, key) => {
                    if (key === url) {
                        panel.webview.html = this.renderHTMLContent(url);
                        panel.title = url || utils_1.extensionName;
                        panel.webview.postMessage({ method: "extension.urlInitial", result: url });
                        panel.reveal(vscode.ViewColumn.Two);
                    }
                });
            }
            else {
                const panel = vscode.window.createWebviewPanel(utils_1.extensionName, utils_1.extensionName, vscode.ViewColumn.Two, {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                });
                panel.webview.html = this.renderHTMLContent(url);
                panel.title = url || utils_1.extensionName;
                panel.webview.postMessage({ method: "extension.urlInitial", result: url });
                panel.webview.onDidReceiveMessage(message => {
                    switch (message.type) {
                        case "Page.changeUrl":
                            panel.webview.html = this.renderHTMLContent(message.params.url);
                            panel.title = message.params.url || utils_1.extensionName;
                            return;
                        case "Page.appStateChanged":
                            panel.webview.postMessage({
                                method: "extension.appStateChanged",
                                result: message.params.state,
                            });
                            return;
                        case "Page.openDoc":
                            vscode.env.openExternal(message.params.url);
                            return;
                    }
                }, undefined, this.context.subscriptions);
                panel.onDidDispose(() => {
                    this.openWindowsMap.delete(url);
                }, undefined, this.context.subscriptions);
                this.openWindowsMap.set(url, panel);
            }
        });
    }
    disposeByUrl(url) {
        this.openWindowsMap.forEach((panel, key) => {
            if (key === url) {
                panel.dispose();
            }
        });
    }
}
exports.default = WebviewManager;

//# sourceMappingURL=webview.js.map
