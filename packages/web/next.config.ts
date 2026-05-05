import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	turbopack: {
		// pnpm workspace 構成で node_modules が /root/node_modules に置かれるため
		// Next.js がパッケージを解決できるようワークスペースルートを指定する
		root: path.resolve(__dirname, "../.."),
	},
};

export default nextConfig;
