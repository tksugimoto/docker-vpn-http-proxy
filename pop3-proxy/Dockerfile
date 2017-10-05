FROM ubuntu:16.04

ARG http_proxy
ARG https_proxy

# node 6をinstall
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get install -y nodejs

COPY pop3-proxy-server /etc/pop3-proxy-server

CMD ["node", "/etc/pop3-proxy-server/index.js"]
