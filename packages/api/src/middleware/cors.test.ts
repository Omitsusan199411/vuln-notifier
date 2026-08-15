import { afterEach, describe, expect, it, vi } from "vitest";

describe("Cors Middleware Unit Test", () => {
	const corsEnv = process.env.CORS_ORIGIN;

	afterEach(() => {
		process.env.CORS_ORIGIN = corsEnv;
		vi.resetModules();
	});

	it("CORS_ORIGINが未設定の場合、エラーを投げること", async () => {
		delete process.env.CORS_ORIGIN;
		vi.resetModules();

		await expect(import("@/middleware/cors.js")).rejects.toThrow(
			"CORS origin environment variable is required",
		);
	});

	it("CORS_ORIGINが設定されている場合、エラーにならないこと", async () => {
		process.env.CORS_ORIGIN = "http://localhost:4000";
		vi.resetModules();

		await expect(import("@/middleware/cors.js")).resolves.toBeDefined();
	});
});
