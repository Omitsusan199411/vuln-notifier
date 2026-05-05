import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Vitest ワークスペース構成: 各パッケージの vitest.config.ts を参照して環境を分けて実行する（モノレポに対応）
		projects: ["./packages/api", "./packages/web"],
	},
});
