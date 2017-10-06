@echo off

docker-compose exec vpn sh -c "openvpn /etc/vpn-config/*.ovpn"
