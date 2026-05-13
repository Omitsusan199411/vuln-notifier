import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	// macOS + Docker 環境ではFSEventsが届かないためポーリングで変更を検知する
	watchOptions: {
		pollIntervalMs: 500,
	},
};

export default nextConfig;
