FROM ubuntu:16.04

ARG http_proxy
ARG https_proxy

RUN apt-get update && apt-get install -y openvpn

# node 6をinstall
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get install -y nodejs

CMD ["node", "/etc/http-proxy-server/index.js"]
