import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import { PrismaLlmModelRepository } from "@/infrastructure/prisma/llm-model/repository.js";
import { llmModelFactory } from "@/testing/factories/persisted/llm-model.js";

describe("Prisma LlmModel Integration Test", () => {
	let repository: PrismaLlmModelRepository;

	beforeEach(() => {
		repository = new PrismaLlmModelRepository();
	});

	describe("findByテスト", () => {
		it("DBに存在するllmModelIdを渡した場合、該当するLlmModelレコードを返すこと", async () => {
			const createdLlmModel = await llmModelFactory.create();

			const llmModel = await repository.findById(createdLlmModel.id);

			expect(llmModel).not.toBeNull();
			expect(llmModel?.id).toBe(createdLlmModel.id);
		});

		it("DBに存在しないllmModelIdを渡した場合、該当するLlmModelレコードを返すこと", async () => {
			const dummyLlmModelId = faker.string.nanoid();
			await llmModelFactory.createList(5);

			const llmModel = await repository.findById(dummyLlmModelId);

			expect(llmModel).toBeNull();
		});
	});
});
