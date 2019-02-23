#!/bin/sh

docker-compose exec vpn sh -c "openvpn /etc/vpn-config/*.ovpn"
