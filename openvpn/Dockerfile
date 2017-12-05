FROM ubuntu:16.04

RUN apt-get update && apt-get install -y openvpn

# Squidをinstall
RUN apt-get update && apt-get install -y squid3

COPY squid.conf /etc/squid/squid.conf

# -N: No daemon mode.
CMD ["squid", "-N"]
