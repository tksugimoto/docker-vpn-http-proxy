# Docker VPN HTTP Proxy
複数のVPN接続を行なうためのDockerコンテナ

## 動作原理
![構成図](doc/image/configuration_diagram.png)
* Dockerコンテナ内でVPN接続
    * OpenVPN を使用
* Dockerコンテナ内で起動しているHTTPプロキシ経由でアクセス
    * ※ プロキシサーバーは `docker-compose up` で自動起動
    * コンテナ内で動作するプロキシのため、VPNへのアクセスが可能
* 1コンテナ 1VPN 1proxyのため、接続するVPNごとに実行

## 使い方
1. git, docker, docker-compose をインストール
1. 接続したいVPNの数だけ以下を繰り返す
    1. このフォルダを複製（ `git clone`, `cp`, etc）
    1. プロキシサーバー用ソースコードの準備  
        Git submodule を使って別リポジトリを参照しているのでgitコマンドの実行が必要
        1. `git submodule init`
        1. `git submodule update`
    1. 環境変数設定
        * `cp .env.sample .env`
        * `.env` ファイルを編集（詳細は後述）
    1. `vpn-config` フォルダに `.ovpn` 拡張子のOpenVPN用設定ファイルを配置
        * ファイル名は自由（`.ovpn` 拡張子で検索する）
        * フォルダ内に1つの `.ovpn` 拡張子のみ可
    1. `docker-compose up`
    1. `.env` で設定したプロキシ `<IP>:<PORT>` をブラウザやOSのプロキシ設定に登録
        * おすすめ：`proxy.pac` を使用
            * 複数VPNを同時利用する場合は必須
    1. `connect-vpn.bat` を実行

### 設定値 (`.env` ファイル)
* `key=value` 形式
    * ※ `=` 前後には空白無し
* `#` 始まりはコメント行

#### `PROXY_BIND_IP_PORT`
コンテナ内のproxyのbindをhost側につなげる際のhost側の待ち受けIP:PORT
```
PROXY_BIND_IP_PORT=127.0.0.1:18080
```
※ Docker Toolbox (VirtualBox) を使っている場合は、コンテナの待ち受けIPを `0.0.0.0` として、ブラウザに設定するプロキシは、VMのIPにする必要がある（VMのIPは以下のコマンド確認可能）。
```
docker-machine ip
```

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
