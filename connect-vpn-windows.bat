@echo off

docker-compose exec --user root vpn sh -c "openvpn /etc/vpn-config/*.ovpn"
