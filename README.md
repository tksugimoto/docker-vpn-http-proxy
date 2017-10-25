# Docker VPN HTTP Proxy
複数のVPN接続を行なうためのDockerコンテナ

## 動作原理
* Dockerコンテナ内でVPN接続
    * OpenVPN を使用
* Dockerコンテナ内で起動しているHTTPプロキシ経由でアクセス
    * ※ プロキシサーバーは `docker-compose up` で自動起動
    * コンテナ内で動作するプロキシのため、VPNへのアクセスが可能
* 1コンテナ 1VPN 1proxyのため、接続するVPNごとに実行

## 使い方
1. docker, docker-compose をインストール
1. 接続したいVPNの数だけ以下を繰り返す
    1. このディレクトリを複製（ `git clone`, `cp`, etc）
    1. 環境変数設定
        * `cp .env.sample .env`
        * `.env` ファイルを編集
    1. `vpn-config` フォルダに `.ovpn` 拡張子のOpenVPN用設定ファイルを配置
        * ファイル名は自由（`.ovpn` 拡張子で検索する）
        * フォルダ内に1つの `.ovpn` 拡張子のみ可
    1. `docker-compose up`
    1. `.env` で設定したプロキシ `<IP>:<PORT>` をブラウザやOSのプロキシ設定に登録
        * おすすめ：`proxy.pac` を使用
            * 複数VPNを同時利用する場合は必須
    1. `connect-vpn.bat` を実行
