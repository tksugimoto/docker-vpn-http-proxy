FROM alpine:3.10

RUN apk add --update-cache --no-cache  openvpn

RUN apk add --update-cache --no-cache  squid

# TZ環境変数でタイムゾーンを変更できるようにするため
RUN apk add --update-cache --no-cache  tzdata

# ログを標準出力に出すために必要
USER squid

# -N: No daemon mode.
CMD ["squid", "-N"]

COPY squid.conf /etc/squid/squid.conf
