import { describe, expect, it } from "vitest";
import { PrismaBatchRepository } from "@/infrastructure/prisma/batch/repository.js";
import { batchFactory } from "@/testing/factories/persisted/batch.js";

describe("Prisma Batch Integration Test", () => {
	describe("findByテスト", () => {
		it("DBに存在するbatchIdを渡した場合、該当するBatchオブジェクトを返すこと", async () => {
			const repository = new PrismaBatchRepository();
			const createdBatch = await batchFactory.create();

			const batch = await repository.findById(createdBatch.id);

			expect(batch).not.toBeNull();
			expect(batch?.id).toBe(createdBatch.id);
		});

		it("DBに存在しないbatchIdを渡した場合、nullを返すこと", async () => {});
	});
});
