# Docker VPN HTTP Proxy
複数のVPN接続を行なうためのDockerコンテナ

## 動作原理
![構成図](doc/image/configuration_diagram.png)
* Dockerコンテナ内でVPN接続
    * OpenVPN を使用
* Dockerコンテナ内で起動しているHTTPプロキシ経由でアクセス
    * ※ プロキシサーバーは `docker-compose up` で自動起動
    * コンテナ内で動作するプロキシのため、VPNへのアクセスが可能
    * （オプション）POP3プロキシサーバー経由でメール受信も可能
* 1コンテナ 1VPN 1proxyのため、接続するVPNごとに実行

## 使い方
1. docker, docker-compose をインストール
1. 接続したいVPNの数だけ以下を繰り返す
    1. このフォルダを複製（ `git clone`, `cp`, etc）
    1. 環境変数設定
        * `cp .env.sample .env`
        * `.env` ファイルを編集（詳細は後述）
    1. `vpn-config` フォルダに `.ovpn` 拡張子のOpenVPN用設定ファイルを配置
        * ファイル名は自由（`.ovpn` 拡張子で検索する）
        * フォルダ内に1つの `.ovpn` 拡張子のみ可
    1. `docker-compose up -d`
    1. `.env` で設定したプロキシ `<IP>:<PORT>` をブラウザやOSのプロキシ設定に登録
        * おすすめ：`proxy.pac` を使用
            * 複数VPNを同時利用する場合は必須
        * POP3プロキシを使う場合はメーラーの設定を変更（`設定値` 参照）
    1. `connect-vpn.bat` を実行

### 設定値 (`.env` ファイル)
* `key=value` 形式
    * ※ `=` 前後には空白無し
* `#` 始まりはコメント行

#### `http_proxy`
インターネットアクセスにプロキシの設定が必要ならコメントアウトを外してアドレス:PORTを編集

```
# http_proxy=proxy.example.com:8080
```

Docker image build 時の `openvpn` & `squid` インストールに使用

※ すでに環境変数にセットされているならこのファイルでのセットは不要

#### `PROXY_BIND_IP_PORT`
コンテナ内のproxyのbindをhost側につなげる際のhost側の待ち受けIP:PORT
```
PROXY_BIND_IP_PORT=127.0.0.1:18080
```
※ Docker Toolbox (VirtualBox) を使っている場合は、コンテナの待ち受けIPを `0.0.0.0` として、ブラウザに設定するプロキシは、VMのIPにする必要がある（VMのIPは以下のコマンド確認可能）。
```
docker-machine ip
```

#### `COMPOSE_FILE`
POP3プロキシサーバーも起動するかの切り替えに使用

* POP3プロキシサーバー無し
    ```
    COMPOSE_FILE=docker-compose.yml
    ```
* POP3プロキシサーバー有り
    ```
    COMPOSE_FILE=docker-compose.yml;docker-compose.pop3.yml
    ```

#### `POP3_BIND_IP_PORT`
コンテナ内のPOP3プロキシサーバーのbindをhost側につなげる際のhost側の待ち受けIP:PORT
```
POP3_BIND_IP_PORT=127.0.0.1:10110
```
メーラーの設定を上記 `POP3_BIND_IP_PORT` の `IP:PORT` に変更する

#### `POP3_PROXY_TARGET`
POP3(TCP)パケットを転送する先のIP(host):PORT
```
POP3_PROXY_TARGET=example.com:110
```
メーラーにもともと設定してあったIP(host):PORT

## Tips
### OpenVPN にプロキシを使わせる方法
`vpn-config` フォルダに配置した設定ファイル（`.ovpn` 拡張子）に以下のプロキシ設定を追加
```
http-proxy <proxy_fqdn> <proxy_port>
```
例
```
http-proxy proxy.example.com 8080
```

### OpenVPN でのログイン時にUser IDの入力を省略する方法
1. `vpn-config` フォルダに `user.txt` ファイルを作成
1. `user.txt` ファイルの1行目にUser IDを記述
1. `vpn-config` フォルダに配置した設定ファイル（`.ovpn` 拡張子）に以下の認証設定を追加
    ```
    auth-user-pass /etc/vpn-config/user.txt
    ```
    * ※ すでに、 `auth-user-pass` 行が存在する場合は置き換え

## よくある質問
### VPNログインできない（`connect-vpn.bat` が即座に閉じる）
#### 発生例
* PC再起動後
    * `restart: always` にしてあり自動起動するが、正常起動しない場合あり
#### 対応
dockerコンテナの再起動
```
docker-compose restart
```

### `connect-vpn.bat` ウィンドウが勝手に閉じる
#### 原因
* ログイン時
    * User ID & Password が間違っている
* ログイン成功後
    * VPN接続の切断（ネットワークやサーバー側の問題など）
#### 対応
再ログイン


## 既知の問題
### VPN側のIPがDockerで使われているネットワークのIPアドレス範囲に含まれていると対象IPのVPN側サーバーと通信できない
### 例）コンテナ内ネットワーク

確認コマンド
```
docker-compose exec -T vpn sh -c 'ip -f inet addr'
```
出力（例）
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
46: eth0@if47: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default  link-netnsid 0
    inet 172.18.0.2/16 scope global eth0
       valid_lft forever preferred_lft forever
```
この場合、 `172.18.0.2/16` にVPN側のIPが含まれていると通信できない
