import { beforeEach, describe, expect, it } from "vitest";
import { AppLlmTokenUsage } from "@/domain/app-llm-token-usage/entity.js";
import { PrismaAppLlmTokenUsage } from "@/infrastructure/prisma/app-llm-token-usage/repository.js";
import { newAppLlmTokenUsagePropsFactory } from "@/testing/factories/app-llm-token-usage.js";
import { appLlmTokenUsageFactory } from "@/testing/factories/persisted/app-llm-token-usage.js";
import { llmModelFactory } from "@/testing/factories/persisted/llm-model.js";

describe("Prisma AppLlmTokenUsage Repository Integration Test", () => {
	let repository: PrismaAppLlmTokenUsage;

	beforeEach(() => {
		repository = new PrismaAppLlmTokenUsage();
	});

	describe("findByModelYearMonthメソッド", () => {
		it("指定したmodelId, year, monthを持つappLlmTokenUsageレコードを取得できること", async () => {
			const modelId = (await llmModelFactory.create()).id;
			const exampleDate = new Date("2020-01-01");
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;

			const targetAppLlmTokenUsage = await appLlmTokenUsageFactory.create({
				modelId,
				year,
				month,
			});

			await appLlmTokenUsageFactory.createList(5);

			const foundAppLlmTokenUsage = await repository.findByModelYearMonth(
				targetAppLlmTokenUsage,
			);

			expect(foundAppLlmTokenUsage?.id).toBe(targetAppLlmTokenUsage.id);
			expect(foundAppLlmTokenUsage?.modelId).toBe(
				targetAppLlmTokenUsage.modelId,
			);
			expect(foundAppLlmTokenUsage?.year).toBe(targetAppLlmTokenUsage.year);
			expect(foundAppLlmTokenUsage?.month).toBe(targetAppLlmTokenUsage.month);
			expect(foundAppLlmTokenUsage?.inputTokens).toBe(
				targetAppLlmTokenUsage.inputTokens,
			);
			expect(foundAppLlmTokenUsage?.outputTokens).toBe(
				targetAppLlmTokenUsage.outputTokens,
			);
		});

		it("指定したmodelId, year, monthを持つappLlmTokenUsageレコードがテーブルにない場合、nullが返ってくること", async () => {
			await appLlmTokenUsageFactory.createList(5);

			const foundAppLlmTokenUsage = await repository.findByModelYearMonth({
				modelId: "test",
				year: 1900,
				month: 1,
			});

			expect(foundAppLlmTokenUsage).toBeNull();
		});
	});

	describe("fetchListメソッド", () => {
		it("cursorで指定した場合、指定したIDの次のIDのappLlmTokenUsageがレコードから取得されること", async () => {
			await appLlmTokenUsageFactory.createList(5);

			const { appLlmTokenUsages: allAppLlmTokenUsages } =
				await repository.fetchList({});
			const cursorIndex = 1;
			const cursor = allAppLlmTokenUsages[cursorIndex].id;

			const { appLlmTokenUsages } = await repository.fetchList({
				cursor,
			});

			expect(
				appLlmTokenUsages.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			).toEqual(
				allAppLlmTokenUsages
					.slice(cursorIndex + 1)
					.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			);
		});

		it("cursorで指定しない場合は、先頭ページのappLlmTokenUsageレコードから取得されること", async () => {
			const targetLimit = 10;
			const createdAppLlmTokenUsage = [];
			for (let i = 0; i < targetLimit + 1; i++) {
				createdAppLlmTokenUsage.push(await appLlmTokenUsageFactory.create());
			}

			const { appLlmTokenUsages } = await repository.fetchList({
				limit: targetLimit,
				sort: "asc",
			});

			expect(appLlmTokenUsages).toHaveLength(targetLimit);
			expect(
				appLlmTokenUsages.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			).toEqual(
				createdAppLlmTokenUsage
					.slice(0, targetLimit)
					.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			);
		});

		it("yearで指定したappLlmTokenUsageレコードが取得できること", async () => {
			await appLlmTokenUsageFactory.createList(5);

			const year = 2010;
			await appLlmTokenUsageFactory.create({
				year,
			});

			const { appLlmTokenUsages } = await repository.fetchList({
				year,
			});

			expect(appLlmTokenUsages).toHaveLength(1);
			expect(appLlmTokenUsages[0].year).toBe(year);
		});

		it("monthで指定したappLlmTokenUsageレコードが取得できること", async () => {
			const targetYearMonths = [
				{ year: 2024, month: 8 },
				{ year: 2025, month: 9 },
				{ year: 2025, month: 10 },
			];

			for (const yearMonth of targetYearMonths) {
				await appLlmTokenUsageFactory.create({
					year: yearMonth.year,
					month: yearMonth.month,
				});
			}

			const targetMonth = 1;
			await appLlmTokenUsageFactory.create({
				month: targetMonth,
			});

			const { appLlmTokenUsages } = await repository.fetchList({
				month: targetMonth,
			});

			expect(appLlmTokenUsages).toHaveLength(1);
			expect(appLlmTokenUsages[0].month).toBe(targetMonth);
		});

		it("modelIdで指定したappLlmTokenUsageレコードが取得できること", async () => {
			await appLlmTokenUsageFactory.createList(5);

			const modelId = (await llmModelFactory.create()).id;
			await appLlmTokenUsageFactory.create({
				modelId,
			});

			const { appLlmTokenUsages } = await repository.fetchList({
				modelId,
			});

			expect(appLlmTokenUsages).toHaveLength(1);
			expect(appLlmTokenUsages[0].modelId).toBe(modelId);
		});

		it("sort（昇順）で指定したソート順でappLlmTokenUsageレコードが取得できること", async () => {
			const createdAppLlmTokenUsages = [];

			for (let i = 0; i < 3; i++) {
				createdAppLlmTokenUsages.push(await appLlmTokenUsageFactory.create());
			}

			const { appLlmTokenUsages } = await repository.fetchList({
				sort: "asc",
			});

			expect(
				appLlmTokenUsages.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			).toEqual(
				createdAppLlmTokenUsages
					.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
					.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			);
		});

		it("sort（降順）で指定したソート順でappLlmTokenUsageレコードが取得できること", async () => {
			const createdAppLlmTokenUsages = [];

			for (let i = 0; i < 3; i++) {
				createdAppLlmTokenUsages.push(await appLlmTokenUsageFactory.create());
			}

			const { appLlmTokenUsages } = await repository.fetchList({
				sort: "desc",
			});

			expect(
				appLlmTokenUsages.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			).toEqual(
				createdAppLlmTokenUsages
					.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
					.map((appLlmTokenUsage) => appLlmTokenUsage.id),
			);
		});

		describe("ページネーションの境界値テスト", () => {
			it("該当レコード数がlimitと一致する場合、次ページがない判定（lastCursorがnull）されること", async () => {
				const targetLimit = 10;
				const targetCount = 10;

				await appLlmTokenUsageFactory.createList(targetCount);
				const { appLlmTokenUsages, lastCursor } = await repository.fetchList({
					limit: targetLimit,
				});

				expect(appLlmTokenUsages).toHaveLength(targetLimit);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより少ない場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetLimit = 10;
				const targetCount = 9;

				await appLlmTokenUsageFactory.createList(targetCount);

				const { appLlmTokenUsages, lastCursor } = await repository.fetchList({
					limit: targetLimit,
				});

				expect(appLlmTokenUsages).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより多い場合、limit件に切り詰められて、次ページがある判定（lastCursorが存在する）がされること", async () => {
				const targetLimit = 10;
				const targetCount = 11;

				await appLlmTokenUsageFactory.createList(targetCount);

				const { appLlmTokenUsages, lastCursor } = await repository.fetchList({
					limit: targetLimit,
				});

				expect(appLlmTokenUsages).toHaveLength(targetLimit);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(appLlmTokenUsages.at(-1)?.id);
			});

			it("limitで指定しなかった場合、かつ該当レコード数がデフォルトlimit（10）より多い場合、デフォルト値の10件に切り詰められてappLlmTokenUsageレコードが取得できること", async () => {
				const defaultLimit = 10;
				const targetCount = 11;

				await appLlmTokenUsageFactory.createList(targetCount);

				const { appLlmTokenUsages, lastCursor } = await repository.fetchList(
					{},
				);

				expect(appLlmTokenUsages).toHaveLength(defaultLimit);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(appLlmTokenUsages.at(-1)?.id);
			});
		});
	});

	describe("createメソッド", () => {
		it("appLlmTokenUsageレコードが新規登録されること", async () => {
			const llmModelId = (await llmModelFactory.create()).id;
			const newAppLlmTokenUsageProps = newAppLlmTokenUsagePropsFactory.build({
				modelId: llmModelId,
			});
			const data = AppLlmTokenUsage.create(newAppLlmTokenUsageProps);

			const createdAppLlmTokenUsage = await repository.create(data);

			expect(createdAppLlmTokenUsage.id).toBeDefined();
			expect(createdAppLlmTokenUsage.year).toBe(newAppLlmTokenUsageProps.year);
			expect(createdAppLlmTokenUsage.month).toBe(
				newAppLlmTokenUsageProps.month,
			);
			expect(createdAppLlmTokenUsage.modelId).toBe(
				newAppLlmTokenUsageProps.modelId,
			);
			expect(createdAppLlmTokenUsage.inputTokens).toBe(
				newAppLlmTokenUsageProps.inputTokens,
			);
			expect(createdAppLlmTokenUsage.outputTokens).toBe(
				newAppLlmTokenUsageProps.outputTokens,
			);
		});

		it("既に同じmodelId, year, monthを持つappLlmTokenUsageレコードが存在した場合、エラーが発生すること", async () => {
			const modelId = (await llmModelFactory.create()).id;
			const exampleDate = new Date("2020-01-01");
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;

			await appLlmTokenUsageFactory.create({
				modelId,
				year,
				month,
			});

			const newAppLlmTokenUsageProps = newAppLlmTokenUsagePropsFactory.build({
				modelId,
				year,
				month,
			});
			const data = AppLlmTokenUsage.create(newAppLlmTokenUsageProps);

			await expect(repository.create(data)).rejects.toThrow();
		});
	});

	describe("updateメソッド", () => {
		it("既に登録済みのappLlmTokenUsageレコードが更新されること", async () => {
			const exampleDate = new Date();
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;
			const updatedYear = year + 1;
			const updatedMonth = month === 12 ? 1 : month + 1;
			const createdAppLlmTokenUsage = await appLlmTokenUsageFactory.create({
				year,
				month,
			});

			const data = AppLlmTokenUsage.reconstruct({
				...createdAppLlmTokenUsage,
				year: updatedYear,
				month: updatedMonth,
			});

			const updatedAppLlmTokenUsage = await repository.update(data);

			expect(updatedAppLlmTokenUsage.id).toBe(createdAppLlmTokenUsage.id);
			expect(updatedAppLlmTokenUsage.year).toBe(updatedYear);
			expect(updatedAppLlmTokenUsage.month).toBe(updatedMonth);
			expect(updatedAppLlmTokenUsage.modelId).toBe(
				createdAppLlmTokenUsage.modelId,
			);
			expect(updatedAppLlmTokenUsage.inputTokens).toBe(
				createdAppLlmTokenUsage.inputTokens,
			);
			expect(updatedAppLlmTokenUsage.outputTokens).toBe(
				createdAppLlmTokenUsage.outputTokens,
			);
		});

		it("appLlmTokenUsageレコードに存在しないidが指定された場合、エラーが発生すること", async () => {
			const exampleDate = new Date();
			const year = exampleDate.getFullYear();
			const month = exampleDate.getMonth() + 1;
			const updatedYear = year + 1;
			const updatedMonth = month === 12 ? 1 : month + 1;
			const createdAppLlmTokenUsage = await appLlmTokenUsageFactory.create({
				year,
				month,
			});

			const data = AppLlmTokenUsage.reconstruct({
				...createdAppLlmTokenUsage,
				year: updatedYear,
				month: updatedMonth,
				id: "test",
			});

			await expect(repository.update(data)).rejects.toThrow();
		});
	});
});
