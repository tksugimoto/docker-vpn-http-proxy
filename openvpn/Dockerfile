FROM ubuntu:16.04

ARG http_proxy

RUN apt-get update

RUN apt-get install -y openvpn

RUN apt-get install -y nodejs

CMD ["nodejs", "/etc/http-proxy-server/index.js"]
