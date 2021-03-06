"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
var ECommandsData;
(function (ECommandsData) {
    ECommandsData["START"] = "preview.start";
    ECommandsData["GENERATEYML"] = "preview.generateYml";
})(ECommandsData || (ECommandsData = {}));
class CommandsManager {
    constructor(context) {
        this.context = context;
    }
    registerCommandFactory(cmd) {
        return (fn) => {
            this.context.subscriptions.push(vscode.commands.registerCommand(cmd, fn));
        };
    }
    onListenStartPreviewCommands(cb) {
        this.registerCommandFactory(ECommandsData.START)(() => {
            if (cb)
                cb();
        });
    }
    onListenGenerateYmlCommands(cb) {
        this.registerCommandFactory(ECommandsData.GENERATEYML)(() => {
            if (cb)
                cb();
        });
    }
}
exports.default = CommandsManager;

//# sourceMappingURL=commands.js.map
