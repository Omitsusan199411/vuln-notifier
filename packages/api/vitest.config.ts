import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: "node",
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
		projects: [
			{
				extends: true,
				test: {
					name: "api-integration",
					include: ["src/infrastructure/prisma/**/*.test.ts"], // 外部ツール（DB）使うテストは統合テストとして扱う
					setupFiles: ["./vitest.setup.ts"],
				},
			},
			{
				extends: true,
				test: {
					name: "api-unit",
					include: ["src/**/*.test.ts"], // 外部ツールと接続しないテストは単体テストとする
					exclude: ["src/infrastructure/prisma/**/*.test.ts"],
				},
			},
		],
	},
	server: {
		cors: false, // HonoのCORSミドルウェアとViteのCORS機能が競合しないように
	},
});
