FROM node:10-alpine

RUN apk add --update-cache --no-cache  tini
ENTRYPOINT ["/sbin/tini", "--"]

COPY tcp-proxy-server /etc/tcp-proxy-server

CMD ["node", "/etc/tcp-proxy-server/index.js"]
