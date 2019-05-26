const assert = require('assert');
const http = require('http');
const net = require('net');

const BIND_PORT = 3000;

const proxyHost = process.env.proxy_host;
const proxyPort = Number(process.env.proxy_port);
assert.ok(1 <= proxyPort && proxyPort <= 65535, `proxy_port must be a number between 1 and 65535. The specified value is "${process.env.proxy_port}".`);
const proxyTarget = process.env.proxy_target;

const tcpProxyServer = net.createServer();

tcpProxyServer.on('connection', (clientSocket) => {
    http.request({
        host : proxyHost,
        port : proxyPort,
        path : proxyTarget,
        method: 'CONNECT',
    })
    .on('connect', (res, serverSocket) => {
        serverSocket.pipe(clientSocket).pipe(serverSocket);
    })
    .on('error', err => {
        clientSocket.end(err.message);
        console.warn({
            type: 'requestToProxyServer.error',
            time: new Date(),
            err,
        });
    })
    .end();
});

tcpProxyServer.listen(BIND_PORT, () => {
    console.info(`TCP proxy server started. (IP:port = 0.0.0.0:${BIND_PORT})`);
    console.log(`Forward to ${proxyTarget}`);
});
