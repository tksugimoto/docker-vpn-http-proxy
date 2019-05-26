const http = require('http');
const net = require('net');

const BIND_PORT = 3000;

const tcpProxyServer = net.createServer();

tcpProxyServer.on('connection', (clientSocket) => {
    http.request({
        host : process.env.proxy_host,
        port : 8080,
        path : process.env.proxy_target,
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
    console.log(`Forward to ${process.env.proxy_target}`);
});
