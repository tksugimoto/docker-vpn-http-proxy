FROM ubuntu:16.04

ARG http_proxy
ARG https_proxy

RUN apt-get update && apt-get install -y openvpn

# Squidをinstall
RUN apt-get update && apt-get install -y squid3

COPY squid.conf /etc/squid/squid.conf

# -N: No daemon mode.
CMD ["squid", "-N"]
