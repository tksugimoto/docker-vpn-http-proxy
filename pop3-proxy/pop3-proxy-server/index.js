const http = require('http');
const net = require('net');

const POP3_BIND_PORT = 110;

const pop3Server = net.createServer();

pop3Server.on('connection', (clientSocket) => {
    http.request({
        host : 'vpn_http_proxy',
        port : 8080,
        path : process.env.pop3_proxy_target,
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

pop3Server.listen(POP3_BIND_PORT, () => {
    console.info(`Pop3 proxy server started. (IP:port = 0.0.0.0:${POP3_BIND_PORT})`);
    console.log(`Forward to ${process.env.pop3_proxy_target}`);
});
