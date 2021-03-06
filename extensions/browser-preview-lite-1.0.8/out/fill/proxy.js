"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const httpProxy = require("http-proxy");
class NodeProxyServer {
    constructor() {
        this.proxy = httpProxy.createProxyServer({});
        this.getPortAndUrl = (req) => {
            const referer = req.headers.referer ? req.headers.referer.replace(`http://${req.headers.host}/`, "") : "";
            const url = /([0-9]+)(\/?)(.*)/.exec(referer + req.url);
            if (Array.isArray(url) && url.length >= 4)
                url[2] = url[2] + url[3];
            return url;
        };
        this.proxyServer = http.createServer((req, res) => {
            const url = this.getPortAndUrl(req);
            if (!Array.isArray(url))
                return;
            req.url = url[2];
            this.proxy.web(req, res, { target: "http://127.0.0.1:" + this.port }, (err, req) => {
                console.log("port: " + this.port + " url: " + req.url + " error: " + JSON.stringify(err));
                res.writeHead(502, { "Content-Type": "text/plain" });
                res.write("request fail proxy to: " + req.url + "\n" + JSON.stringify(req.headers, null, 2));
                res.end();
            });
        });
        this.proxyServer.on("upgrade", (req, socket, head) => {
            const url = this.getPortAndUrl(req);
            if (!Array.isArray(url))
                return;
            req.url = url[2];
            this.proxy.ws(req, socket, head, { target: "ws://127.0.0.1:" + this.port, ws: true });
        });
    }
    setPort(port) {
        this.port = port;
        return this;
    }
}
exports.default = NodeProxyServer;

//# sourceMappingURL=proxy.js.map
