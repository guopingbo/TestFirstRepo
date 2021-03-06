"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
class TokenManager {
    constructor() {
        this.init();
    }
    init() {
        this.accessToken = "";
        this.accessLinkToken = "";
        this.spacekey = "";
        this.apiOrigin = "";
        this.domain = "";
        return this;
    }
    setData(data) {
        if (!data)
            return this;
        if (data.accessToken)
            this.accessToken = data.accessToken;
        if (data.accessLinkToken)
            this.accessLinkToken = data.accessLinkToken;
        if (data.spacekey)
            this.spacekey = data.spacekey;
        if (data.apiOrigin)
            this.apiOrigin = data.apiOrigin;
        if (data.domain)
            this.domain = data.domain;
        return this;
    }
    isAuthorization() {
        return this.accessToken && this.spacekey && this.apiOrigin ? true : false;
    }
    getProtocol() {
        return this.apiOrigin.split("://")[0] || "http";
    }
    getAssemblyUrl(port) {
        return `${this.getProtocol()}://${this.spacekey}-${this.accessLinkToken}-${port}.${this.domain}`;
    }
    acquireAccessLinkTokenAndDomain() {
        return new Promise(result => {
            const fetchUrl = `${this.apiOrigin}/plugin/get-access-url-token?spaceKey=${this.spacekey}`;
            logger_1.logger.appendLine(fetchUrl);
            const options = {
                headers: {
                    "X-IDE-PLUGIN-ACCESS-TOKEN": this.accessToken,
                },
                rejectUnauthorized: false,
            };
            request.get(fetchUrl, options, (err, response) => {
                if (err) {
                    utils_1.showErrorMessageUnAuthorization();
                    logger_1.logger.appendLine(`[ERROR] ${err.message || ""}`);
                    return;
                }
                try {
                    const responseBody = JSON.parse(response.body);
                    logger_1.logger.appendLine(response.body);
                    result({
                        accessLinkToken: responseBody.data.token,
                        domain: responseBody.data.domain,
                    });
                }
                catch (err) {
                    utils_1.showErrorMessageUnAuthorization();
                    logger_1.logger.appendLine(`[ERROR] ${err.message || ""}`);
                }
            });
        });
    }
}
exports.default = TokenManager;

//# sourceMappingURL=tokenManager.js.map
