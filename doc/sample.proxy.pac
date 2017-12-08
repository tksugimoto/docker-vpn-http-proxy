function FindProxyForURL(url, host) {
	// url: http://www.example.com:80/aaaa
	// host: www.example.com
	//	※ portは含まれない
	var PROXY = "PROXY proxy.intra.example.co.jp:8080";

	var DIRECT = "DIRECT";

	// VPN1用プロキシ
	function isVPN1(host) {
		// 10.1.0.0/16 がVPN1のIPレンジの場合
		if (/^10\.1\.\d+\.\d+$/.test(host)) return true;
		// ドメイン登録も対応
		if (/^project-aaa\.vpn\.example\.co\.jp$/.test(host)) return true;
		return false;
	}
	if (isVPN1(host)) {
		return ["PROXY 127.0.0.1:18080", DIRECT].join("; ");
	}

	// VPN2用プロキシ
	function isVPN2(host) {
		// 10.2.0.0/16 がVPN2のIPレンジの場合
		if (/^10\.2\.\d+\.\d+$/.test(host)) return true;
		// ドメイン登録も対応
		if (/^project-bbb\.vpn\.example\.co\.jp$/.test(host)) return true;
		return false;
	}
	if (isVPN2(host)) {
		return ["PROXY 127.0.0.1:28080", DIRECT].join("; ");
	}


	function isPrivate(host) {
		return /^(10|127)\.\d+\.\d+\.\d+$/.test(host) ||
			/^192\.168\.\d+\.\d+$/.test(host) ||
			/^172\.(1[6789]|2\d|3[01])\.\d+\.\d+$/.test(host);
	}

	// isPlainHostName: [.]ドットが含まれていない場合true（ex: localhost）
	if (isPlainHostName(host) || isPrivate(host)) {
		return DIRECT;
	}

	var DIRECT_APPLY_HOSTS = [
		// 完全一致
		// "www.example.com"
		// 部分一致
		// "*.example.com"
	];
	for (var i = 0, len = DIRECT_APPLY_HOSTS.length; i < len; i++) {
		if (shExpMatch(host, DIRECT_APPLY_HOSTS[i])) {
			return DIRECT;
		}
	}

	var PROXY_APPLY_HOSTS = [
		// 完全一致
		// "www.example.com"
		// 部分一致
		// "*.example.com"
	];
	for (var i = 0, len = PROXY_APPLY_HOSTS.length; i < len; i++) {
		if (shExpMatch(host, PROXY_APPLY_HOSTS[i])) {
			return PROXY;
		}
	}

	// proxy優先（落ちていたらダイレクト）
	return [PROXY, DIRECT].join("; ");
	// 必ずproxy経由
	// return PROXY;
}
