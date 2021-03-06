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
const portscanner = require("portscanner");
const utils_1 = require("../utils");
class PortProvider {
    constructor(ymlTemplate) {
        this.ymlTemplate = ymlTemplate;
    }
    showInputBox() {
        return __awaiter(this, void 0, void 0, function* () {
            const rangPort = (n) => Math.min(65535, Math.max(0, n));
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const renderDefaultItems = () => __awaiter(this, void 0, void 0, function* () {
                    quickPick.items = (yield this.ymlTemplate.getYmlApps()).map(e => ({
                        label: e.name || e.port.toString(),
                        description: `端口号: ${e.port.toString()}`,
                        detail: e.description
                    }));
                });
                const quickPick = vscode.window.createQuickPick();
                yield renderDefaultItems();
                quickPick.placeholder = "请选择一个应用或端口号";
                quickPick.onDidChangeValue((v) => __awaiter(this, void 0, void 0, function* () {
                    let value = rangPort(utils_1.extractNumber(v));
                    if (value && (quickPick.activeItems.length === 0 || quickPick.items.some(e => e.picked === true))) {
                        quickPick.items = [
                            {
                                label: `按下回车将打开 ${value} 端口的预览窗口`,
                                description: '',
                                alwaysShow: true,
                                picked: true,
                            },
                        ];
                    }
                    else {
                        yield renderDefaultItems();
                    }
                }));
                quickPick.onDidAccept(() => {
                    const activeItems = quickPick.selectedItems[0] || { label: quickPick.value, description: '' };
                    if (!activeItems)
                        return;
                    const splitNum = utils_1.extractNumber(activeItems.label) || utils_1.extractNumber(activeItems.description);
                    if (!splitNum)
                        return;
                    quickPick.hide();
                    resolve(parseInt(splitNum.toString()));
                });
                quickPick.onDidHide(() => quickPick.dispose());
                quickPick.show();
            }));
        });
    }
    isActivePort(port) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield portscanner.checkPortStatus(port);
        });
    }
    onListenPortActive(port) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxTimeoutCount = 60;
            return new Promise(resolve => {
                const retryPort = (count) => __awaiter(this, void 0, void 0, function* () {
                    if (count === 0) {
                        resolve(false);
                        return;
                    }
                    yield utils_1.sleep(500);
                    if ((yield this.isActivePort(port)) === "open") {
                        resolve(true);
                        return;
                    }
                    else {
                        retryPort(count - 1);
                    }
                });
                retryPort(maxTimeoutCount);
            });
        });
    }
    acquireStartPort() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.showInputBox();
        });
    }
}
exports.default = PortProvider;

//# sourceMappingURL=port.js.map
