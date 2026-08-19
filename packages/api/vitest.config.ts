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
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			thresholds: {
				lines: 60,
				functions: 60,
				branches: 60,
				statements: 60,
			},
		},
	},
	server: {
		cors: false, // HonoのCORSミドルウェアとViteのCORS機能が競合しないように
	},
});
