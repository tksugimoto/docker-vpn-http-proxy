FROM alpine:3.9

RUN apk --update --no-cache add openvpn

# Squidをinstall
RUN apk --update --no-cache add squid

COPY squid.conf /etc/squid/squid.conf

# -N: No daemon mode.
CMD ["squid", "-N"]
