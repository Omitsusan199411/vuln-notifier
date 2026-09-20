import { beforeEach, describe, expect, it } from "vitest";
import { UserLlmTokenUsage } from "@/domain/user-llm-token-usage/entity.js";
import { PrismaUserLlmTokenUsageRepository } from "@/infrastructure/prisma/user-llm-token-usage/repository.js";
import { llmModelFactory } from "@/testing/factories/persisted/llm-model.js";
import { userFactory } from "@/testing/factories/persisted/user.js";
import { userLlmTokenUsageFactory } from "@/testing/factories/persisted/user-llm-token-usage.js";
import { newUserLlmTokenUsagePropsFactory } from "@/testing/factories/user-llm-token-usage.js";

describe("Prisma UserLlmTokenUsage Repository Integration Test", () => {
	let repository: PrismaUserLlmTokenUsageRepository;

	beforeEach(() => {
		repository = new PrismaUserLlmTokenUsageRepository();
	});

	describe("findByUserModelYearMonthメソッド", () => {
		it("指定したuserId, modelId, year, monthを持つuserLlmTokenUsageレコードを取得できること", async () => {
			const userId = (await userFactory.create()).id;
			const modelId = (await llmModelFactory.create()).id;
			const exampleDate = new Date("2020-01-01");
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;

			const targetUserLlmTokenUsage = await userLlmTokenUsageFactory.create({
				userId,
				modelId,
				year,
				month,
			});

			await userLlmTokenUsageFactory.createList(5);

			const foundUserLlmTokenUsage = await repository.findByUserModelYearMonth(
				targetUserLlmTokenUsage,
			);

			expect(foundUserLlmTokenUsage?.id).toBe(targetUserLlmTokenUsage.id);
			expect(foundUserLlmTokenUsage?.userId).toBe(
				targetUserLlmTokenUsage.userId,
			);
			expect(foundUserLlmTokenUsage?.modelId).toBe(
				targetUserLlmTokenUsage.modelId,
			);
			expect(foundUserLlmTokenUsage?.year).toBe(targetUserLlmTokenUsage.year);
			expect(foundUserLlmTokenUsage?.month).toBe(targetUserLlmTokenUsage.month);
			expect(foundUserLlmTokenUsage?.inputTokens).toBe(
				targetUserLlmTokenUsage.inputTokens,
			);
			expect(foundUserLlmTokenUsage?.outputTokens).toBe(
				targetUserLlmTokenUsage.outputTokens,
			);
		});
		it("指定したuserId, modelId, year, monthを持つuserLlmTokenUsageレコードがテーブルにない場合、nullが返ってくること", async () => {
			await userLlmTokenUsageFactory.createList(5);

			const foundUserLlmTokenUsage = await repository.findByUserModelYearMonth({
				userId: "test",
				modelId: "test",
				year: 1900,
				month: 1,
			});

			expect(foundUserLlmTokenUsage).toBeNull();
		});
	});

	describe("fetchListメソッド", () => {
		let userId: string;

		beforeEach(async () => {
			userId = (await userFactory.create()).id;
		});

		it("cursorで指定した場合、指定したIDの次のIDのuserLlmTokenUsageがレコードから取得されること", async () => {
			await userLlmTokenUsageFactory.createList(5, { userId });

			const { userLlmTokenUsages: allUserLlmTokenUsages } =
				await repository.fetchList({ userId });
			const cursorIndex = 1;
			const cursor = allUserLlmTokenUsages[cursorIndex].id;

			const { userLlmTokenUsages } = await repository.fetchList({
				cursor,
				userId,
			});

			expect(
				userLlmTokenUsages.map(
					(userLlmTokenUsageToken) => userLlmTokenUsageToken.id,
				),
			).toEqual(
				allUserLlmTokenUsages
					.slice(cursorIndex + 1)
					.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			);
		});

		it("cursorで指定しない場合は、先頭ページのuserLlmTokenUsageレコードから取得されること", async () => {
			const targetLimit = 10;
			const createdUserLlmTokenUsage = [];
			for (let i = 0; i < targetLimit + 1; i++) {
				createdUserLlmTokenUsage.push(
					await userLlmTokenUsageFactory.create({ userId }),
				);
			}

			const { userLlmTokenUsages } = await repository.fetchList({
				userId,
				limit: targetLimit,
				sort: "asc",
			});

			expect(userLlmTokenUsages).toHaveLength(targetLimit);
			expect(
				userLlmTokenUsages.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			).toEqual(
				createdUserLlmTokenUsage
					.slice(0, targetLimit)
					.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			);
		});

		it("yearで指定したuserLlmTokenUsageレコードが取得できること", async () => {
			await userLlmTokenUsageFactory.createList(5, { userId });

			const year = 2010;
			await userLlmTokenUsageFactory.create({
				year,
				userId,
			});

			const { userLlmTokenUsages } = await repository.fetchList({
				userId,
				year,
			});

			expect(userLlmTokenUsages).toHaveLength(1);
			expect(userLlmTokenUsages[0].year).toBe(year);
		});

		it("monthで指定したuserLlmTokenUsageレコードが取得できること", async () => {
			const targetYearMonths = [
				{ year: 2024, month: 8 },
				{ year: 2025, month: 9 },
				{ year: 2025, month: 10 },
			];

			for (const yearMonth of targetYearMonths) {
				await userLlmTokenUsageFactory.create({
					userId,
					year: yearMonth.year,
					month: yearMonth.month,
				});
			}

			const targetMonth = 1;
			await userLlmTokenUsageFactory.create({
				month: targetMonth,
				userId,
			});

			const { userLlmTokenUsages } = await repository.fetchList({
				userId,
				month: targetMonth,
			});

			expect(userLlmTokenUsages).toHaveLength(1);
			expect(userLlmTokenUsages[0].month).toBe(targetMonth);
		});

		it("modelIdで指定したuserLlmTokenUsageレコードが取得できること", async () => {
			await userLlmTokenUsageFactory.createList(5, { userId });

			const modelId = (await llmModelFactory.create()).id;
			await userLlmTokenUsageFactory.create({
				modelId,
				userId,
			});

			const { userLlmTokenUsages } = await repository.fetchList({
				userId,
				modelId,
			});

			expect(userLlmTokenUsages).toHaveLength(1);
			expect(userLlmTokenUsages[0].modelId).toBe(modelId);
		});

		it("sort（昇順）で指定したソート順でuserLlmTokenUsageレコードが取得できること", async () => {
			const createdUserLlmTokenUsages = [];

			for (let i = 0; i < 3; i++) {
				createdUserLlmTokenUsages.push(
					await userLlmTokenUsageFactory.create({ userId }),
				);
			}

			const { userLlmTokenUsages } = await repository.fetchList({
				sort: "asc",
				userId,
			});

			expect(
				userLlmTokenUsages.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			).toEqual(
				createdUserLlmTokenUsages
					.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
					.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			);
		});

		it("sort（降順）で指定したソート順でuserLlmTokenUsageレコードが取得できること", async () => {
			const createdUserLlmTokenUsages = [];

			for (let i = 0; i < 3; i++) {
				createdUserLlmTokenUsages.push(
					await userLlmTokenUsageFactory.create({ userId }),
				);
			}

			const { userLlmTokenUsages } = await repository.fetchList({
				sort: "desc",
				userId,
			});

			expect(
				userLlmTokenUsages.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			).toEqual(
				createdUserLlmTokenUsages
					.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
					.map((userLlmTokenUsage) => userLlmTokenUsage.id),
			);
		});

		describe("ページネーションの境界値テスト", () => {
			it("該当レコード数がlimitと一致する場合、次ページがない判定（lastCursorがnull）されること", async () => {
				const targetLimit = 10;
				const targetCount = 10;

				await userLlmTokenUsageFactory.createList(targetCount, { userId });
				const { userLlmTokenUsages, lastCursor } = await repository.fetchList({
					limit: targetLimit,
					userId,
				});

				expect(userLlmTokenUsages).toHaveLength(targetLimit);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより少ない場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetLimit = 10;
				const targetCount = 9;

				await userLlmTokenUsageFactory.createList(targetCount, { userId });

				const { userLlmTokenUsages, lastCursor } = await repository.fetchList({
					limit: targetLimit,
					userId,
				});

				expect(userLlmTokenUsages).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより多い場合、limit件に切り詰められて、次ページがある判定（lastCursorが存在する）がされること", async () => {
				const targetLimit = 10;
				const targetCount = 11;

				await userLlmTokenUsageFactory.createList(targetCount, { userId });

				const { userLlmTokenUsages, lastCursor } = await repository.fetchList({
					limit: targetLimit,
					userId,
				});

				expect(userLlmTokenUsages).toHaveLength(targetLimit);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(userLlmTokenUsages.at(-1)?.id);
			});

			it("limitで指定しなかった場合、かつ該当レコード数がデフォルトlimit（10）より多い場合、デフォルト値の10件に切り詰められてuserLlmTokenUsageレコードが取得できること", async () => {
				const defaultLimit = 10;
				const targetCount = 11;

				await userLlmTokenUsageFactory.createList(targetCount, { userId });

				const { userLlmTokenUsages, lastCursor } = await repository.fetchList({
					userId,
				});

				expect(userLlmTokenUsages).toHaveLength(defaultLimit);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(userLlmTokenUsages.at(-1)?.id);
			});
		});
	});

	describe("createメソッド", () => {
		it("userLlmTokenUsageレコードが新規登録されること", async () => {
			const newUserLlmTokenUsageProps =
				newUserLlmTokenUsagePropsFactory.build();
			const data = UserLlmTokenUsage.create(newUserLlmTokenUsageProps);

			const createdUserLlmTokenUsage = await repository.create(data);

			expect(createdUserLlmTokenUsage.id).toBeDefined();
			expect(createdUserLlmTokenUsage.userId).toBe(
				newUserLlmTokenUsageProps.userId,
			);
			expect(createdUserLlmTokenUsage.year).toBe(
				newUserLlmTokenUsageProps.year,
			);
			expect(createdUserLlmTokenUsage.month).toBe(
				newUserLlmTokenUsageProps.month,
			);
			expect(createdUserLlmTokenUsage.modelId).toBe(
				newUserLlmTokenUsageProps.modelId,
			);
			expect(createdUserLlmTokenUsage.inputTokens).toBe(
				newUserLlmTokenUsageProps.inputTokens,
			);
			expect(createdUserLlmTokenUsage.outputTokens).toBe(
				newUserLlmTokenUsageProps.outputTokens,
			);
		});

		it("既に同じuserId, modelId, year, monthを持つuserLlmTokenUsageレコードが存在した場合、エラーが発生すること", async () => {
			const userId = (await userFactory.create()).id;
			const modelId = (await llmModelFactory.create()).id;
			const exampleDate = new Date("2020-01-01");
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;

			await userLlmTokenUsageFactory.create({
				userId,
				modelId,
				year,
				month,
			});

			const newUserLlmTokenUsageProps = newUserLlmTokenUsagePropsFactory.build({
				userId,
				modelId,
				year,
				month,
			});
			const data = UserLlmTokenUsage.create(newUserLlmTokenUsageProps);

			await expect(repository.create(data)).rejects.toThrow();
		});
	});

	describe("updateメソッド", () => {
		it("既に登録済みのuserLlmTokenUsageレコードが更新されること", async () => {
			const exampleDate = new Date();
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;
			const updatedYear = year + 1;
			const updatedMonth = month === 12 ? 1 : month + 1;
			const createdUserLlmTokenUsage = await userLlmTokenUsageFactory.create({
				year,
				month,
			});

			const data = UserLlmTokenUsage.reconstruct({
				...createdUserLlmTokenUsage,
				year: updatedYear,
				month: updatedMonth,
			});

			const updatedUserLlmTokenUsage = await repository.update(data);

			expect(updatedUserLlmTokenUsage.id).toBe(createdUserLlmTokenUsage.id);
			expect(updatedUserLlmTokenUsage.userId).toBe(
				createdUserLlmTokenUsage.userId,
			);
			expect(updatedUserLlmTokenUsage.year).toBe(updatedYear);
			expect(updatedUserLlmTokenUsage.month).toBe(updatedMonth);
			expect(updatedUserLlmTokenUsage.modelId).toBe(
				createdUserLlmTokenUsage.modelId,
			);
			expect(updatedUserLlmTokenUsage.inputTokens).toBe(
				createdUserLlmTokenUsage.inputTokens,
			);
			expect(updatedUserLlmTokenUsage.outputTokens).toBe(
				createdUserLlmTokenUsage.outputTokens,
			);
		});

		it("userLlmTokenUsageレコードに存在しないidが指定された場合、エラーが発生すること", async () => {
			const exampleDate = new Date();
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;
			const updatedYear = year + 1;
			const updatedMonth = month === 12 ? 1 : month + 1;
			const createdUserLlmTokenUsage = await userLlmTokenUsageFactory.create({
				year,
				month,
			});

			const data = UserLlmTokenUsage.reconstruct({
				...createdUserLlmTokenUsage,
				year: updatedYear,
				month: updatedMonth,
				id: "test",
			});

			await expect(repository.update(data)).rejects.toThrow();
		});
	});
});
