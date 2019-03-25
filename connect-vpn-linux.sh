#!/bin/sh

docker-compose exec --user root vpn sh -c "openvpn /etc/vpn-config/*.ovpn"
