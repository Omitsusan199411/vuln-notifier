import { beforeEach, describe, expect, it } from "vitest";
import { UserLlmTokenBudget } from "@/domain/user-llm-token-budget/entity.js";
import { userFactory } from "@/testing/factories/persisted/user.js";
import { userLlmTokenBudgetFactory } from "@/testing/factories/persisted/user-llm-token-budget.js";
import { PrismaUserLlmTokenBudgetRepository } from "./repository.js";

describe("Prisma UserLllmTokenBudget Integration Test", () => {
	let repository: PrismaUserLlmTokenBudgetRepository;

	beforeEach(() => {
		repository = new PrismaUserLlmTokenBudgetRepository();
	});

	describe("findByUserIdメソッド", () => {
		it("指定したuserIdを持つUserLlmTokenBudgetレコードが取得できること", async () => {
			await userLlmTokenBudgetFactory.createList(5);
			const userId = (await userFactory.create()).id;
			const targetUserLllmTokenBudget = await userLlmTokenBudgetFactory.create({
				userId,
			});

			const userLlmTokenBudget = await repository.findByUserId(userId);

			expect(userLlmTokenBudget?.id).toBeDefined();
			expect(userLlmTokenBudget?.userId).toBe(targetUserLllmTokenBudget.userId);
			expect(userLlmTokenBudget?.monthlyTokenBudget).toBe(
				targetUserLllmTokenBudget.monthlyTokenBudget,
			);
		});

		it("userLlmTokenBudgetsテーブルに存在しないuserIdを指定した場合、nullを返すこと", async () => {
			await userLlmTokenBudgetFactory.createList(5);
			const userId = (await userFactory.create()).id;

			const foundUserLlmTokenBudget = await repository.findByUserId(userId);

			expect(foundUserLlmTokenBudget).toBeNull();
		});
	});

	describe("createメソッド", () => {
		it("userLlmTokenBudgetレコードが新規作成されること", async () => {
			const userId = (await userFactory.create()).id;
			const monthlyTokenBudget = 10000;

			const data = UserLlmTokenBudget.create({
				userId,
				monthlyTokenBudget,
			});

			const createdUserLlmTokenBudget = await repository.create(data);

			expect(createdUserLlmTokenBudget?.id).toBeDefined();
			expect(createdUserLlmTokenBudget?.userId).toBe(userId);
			expect(createdUserLlmTokenBudget?.monthlyTokenBudget).toBe(
				monthlyTokenBudget,
			);
		});

		it("userIdに存在しないユーザーIDを指定した場合、エラーになること", async () => {
			const dummyUserId = "test";
			const monthlyTokenBudget = 10000;

			const data = UserLlmTokenBudget.create({
				userId: dummyUserId,
				monthlyTokenBudget,
			});

			await expect(repository.create(data)).rejects.toThrow();
		});

		it("既にUserLlmTokenBudgetを持つuserIdで作成しようとした場合、エラーになること", async () => {
			const userId = (await userFactory.create()).id;
			const monthlyTokenBudget = 10000;

			await userLlmTokenBudgetFactory.create({
				userId,
				monthlyTokenBudget,
			});

			const data = UserLlmTokenBudget.create({
				userId,
				monthlyTokenBudget,
			});

			await expect(repository.create(data)).rejects.toThrow();
		});
	});

	describe("updateメソッド", () => {
		it("既に登録されているuserLlmTokenBudgetレコードを更新できること", async () => {
			const userId = (await userFactory.create()).id;
			const monthlyTokenBudget = 10000;
			const updatedMonthlyTokenBudget = 20000;

			const createdUserLlmTokenBudget = await userLlmTokenBudgetFactory.create({
				userId,
				monthlyTokenBudget,
			});

			const data = UserLlmTokenBudget.reconstruct({
				...createdUserLlmTokenBudget,
				monthlyTokenBudget: updatedMonthlyTokenBudget,
			});

			const updatedUserLlmTokenBudget = await repository.update(data);

			expect(updatedUserLlmTokenBudget.id).toBe(createdUserLlmTokenBudget.id);
			expect(updatedUserLlmTokenBudget.userId).toBe(userId);
			expect(updatedUserLlmTokenBudget.monthlyTokenBudget).toBe(
				updatedMonthlyTokenBudget,
			);
		});

		it("userLlmTokenBudgetテーブルに存在しないidを指定した場合、エラーになること", async () => {
			const dummyId = "test";
			const userId = (await userFactory.create()).id;
			const monthlyTokenBudget = 10000;

			const data = UserLlmTokenBudget.reconstruct({
				id: dummyId,
				userId,
				monthlyTokenBudget,
			});

			await expect(repository.update(data)).rejects.toThrow();
		});
	});
});
