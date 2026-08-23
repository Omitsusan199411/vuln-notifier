import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: "web",
		environment: "jsdom",
		// testing-libraryのマッチャー等をvitestで使えるようにするため
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		// ホスト上でテストを実行する場合にも環境変数を使えるようにする（コンテナ内はdocker-compose.yamlから提供）
		env: {
			NEXT_PUBLIC_API_URL: "http://localhost:3001",
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			reportsDirectory: "../../coverage/web",
			thresholds: {
				lines: 60,
				functions: 60,
				branches: 60,
				statements: 60,
			},
		},
	},
});
