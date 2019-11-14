FROM node:12-alpine

RUN apk add --update-cache --no-cache  tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "/etc/tcp-proxy-server/index.js"]

COPY tcp-proxy-server /etc/tcp-proxy-server
