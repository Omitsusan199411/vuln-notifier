import { describe, expect, it } from "vitest";
import { app } from "@/index.js";

// TODO: 後で消す（Vitestが動くかを確認するためのテスト）
describe("GET /", () => {
	it("returns Hello Hono!", async () => {
		const res = await app.request("/");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello Hono!");
	});
});
