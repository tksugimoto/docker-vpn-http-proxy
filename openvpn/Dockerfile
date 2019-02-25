FROM alpine:3.9

RUN apk --update --no-cache add openvpn

RUN apk --update --no-cache add squid

# TZ環境変数でタイムゾーンを変更できるようにするため
RUN apk --update --no-cache add tzdata

COPY squid.conf /etc/squid/squid.conf

# ログを標準出力に出すために必要
USER squid

# -N: No daemon mode.
CMD ["squid", "-N"]
