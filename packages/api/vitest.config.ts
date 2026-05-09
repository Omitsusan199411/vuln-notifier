import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		// "test:api": "vitest run --project api"でapiだけをテスト対象とするために、nameを指定
		name: "api",
		environment: "node",
		include: ["src/**/*.test.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
		},
	},
	server: {
		cors: false, // HonoのCORSミドルウェアとViteのCORS機能が競合しないように
	},
});
