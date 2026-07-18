import { serve } from "@hono/node-server";
import app from "@/app.js";

// ブラウザ
//   ↓ HTTPリクエスト
// Node.jsの http.Server（TCP/HTTPプロトコルの処理そのもの。実際にポートをlistenしているのはこの層）
//   ↓ @hono/node-serverが Node形式(IncomingMessage) → Fetch API形式(Request) に変換
// Honoの app.fetch(request)（ルーティング・ミドルウェア・ハンドラを実行）
//   ↓ Fetch API形式のResponseを返す
// @hono/node-serverが Response → Node形式(ServerResponse) に変換
//   ↓
// ブラウザへレスポンス
// Hono自身は「Requestを受け取ってResponseを返す」という、ブラウザやCloudflare Workersが標準で使っているFetch APIの形式でしか会話できない
// しかしNode.jsのhttpモジュールはFetch APIが登場する前からある独自のIncomingMessage/ServerResponseという形式でリクエスト・レスポンスを表現する
// この2つの形式の違いを埋めるのが@hono/node-serverの役目
const server = serve({ ...app, port: 3001 });

// Ctrl+Cによる割り込みでサーバーを停止する処理（処理中のリクエストを待たず即終了する）
process.on("SIGINT", () => {
	server.close();
	process.exit(0);
});

// Docker等からの停止指示でサーバーを安全に停止するための処理（グレースフルシャットダウン）
process.on("SIGTERM", () => {
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
