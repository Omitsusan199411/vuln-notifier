import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		// "test:api": "vitest run --project web"でapiだけをテスト対象とするために、nameを指定
		name: "web",
		environment: "jsdom",
		// testing-libraryのマッチャー等をvitestで使えるようにするため
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/tests/**/*.test.{ts,tsx}"],
		// ホスト上でテストを実行する場合にも環境変数を使えるようにする（コンテナ内はdocker-compose.dev.yamlから提供）
		env: {
			NEXT_PUBLIC_API_URL: "http://localhost:3001",
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
		},
	},
});
