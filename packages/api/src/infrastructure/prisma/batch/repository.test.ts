import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import { PrismaBatchRepository } from "@/infrastructure/prisma/batch/repository.js";
import { batchFactory } from "@/testing/factories/persisted/batch.js";
import { userFactory } from "@/testing/factories/persisted/user.js";

describe("Prisma Batch Integration Test", () => {
	let repository: PrismaBatchRepository;

	beforeEach(() => {
		repository = new PrismaBatchRepository();
	});
	describe("findByテスト", () => {
		it("DBに存在するbatchIdを渡した場合、該当するBatchオブジェクトを返すこと", async () => {
			const createdBatch = await batchFactory.create();

			const batch = await repository.findById(createdBatch.id);

			expect(batch).not.toBeNull();
			expect(batch?.id).toBe(createdBatch.id);
		});

		it("DBに存在しないbatchIdを渡した場合、nullを返すこと", async () => {
			const dummyBatchId = faker.string.uuid({ version: 7 });
			await batchFactory.createList(5);

			const batch = await repository.findById(dummyBatchId);

			expect(batch).toBeNull();
		});
	});

	describe("fetchListテスト", () => {
		it("cursorで指定した場合、指定したIDの次のIDのbatchレコードから取得されること", async () => {
			await batchFactory.createList(5);

			const { batches: allBatches } = await repository.fetchList({});
			const cursorIndex = 1;
			const cursor = allBatches[cursorIndex].id;

			const { batches } = await repository.fetchList({
				cursor,
			});

			expect(batches.map((batch) => batch.id)).toEqual(
				allBatches.slice(cursorIndex + 1).map((batch) => batch.id),
			);
		});

		it("cursorで指定しない場合は、先頭ページのbatchレコードから取得されること", async () => {
			const targetLimit = 10;
			const createBatches = [];
			for (let i = 0; i < targetLimit + 1; i++) {
				createBatches.push(await batchFactory.create());
			}

			// createBatchesがascでpushされるので、dbから参照する側もasc（昇順）を明示する
			const { batches } = await repository.fetchList({
				limit: targetLimit,
				sort: "asc",
			});

			expect(batches).toHaveLength(targetLimit);
			expect(batches.map((batch) => batch.id)).toEqual(
				createBatches.slice(0, targetLimit).map((batch) => batch.id),
			);
		});

		it("triggerTypeで指定したbatchレコードが取得できること", async () => {
			await batchFactory.createList(2, { triggerType: "scheduled" });
			await batchFactory.createList(3, { triggerType: "manual" });

			// { batches, lastCursor }で返るのでbatchesだけを分割代入で取り出す
			const { batches } = await repository.fetchList({
				triggerType: "manual",
			});

			expect(batches).toHaveLength(3);
			expect(batches.every((batch) => batch.triggerType === "manual")).toBe(
				true,
			);
		});

		it("triggeredByに特定のユーザーIDを指定した場合、そのユーザーがトリガーしたbatchレコードのみ取得できること", async () => {
			const user = await userFactory.create();
			const targetCount = 2;
			await batchFactory.createList(targetCount, { triggeredBy: user.id });
			await batchFactory.createList(3, { triggeredBy: null });

			const { batches } = await repository.fetchList({
				triggeredBy: user.id,
			});

			expect(batches).toHaveLength(targetCount);
			expect(batches.every((batch) => batch.triggeredBy === user.id)).toBe(
				true,
			);
		});

		it("triggeredByにnullを指定した場合、自動実行されたbatchレコードのみ取得できること", async () => {
			const users = await userFactory.createList(5);
			const targetCount = 2;
			await batchFactory.createList(targetCount, { triggeredBy: null });
			for (const user of users) {
				await batchFactory.create({ triggeredBy: user.id });
			}

			const { batches } = await repository.fetchList({
				triggeredBy: null,
			});

			expect(batches).toHaveLength(targetCount);
			expect(batches.every((batch) => batch.triggeredBy === null)).toBe(true);
		});

		it("executedAtで指定したbatchレコードが取得できること", async () => {
			const targetDate = new Date();
			await batchFactory.create({ executedAt: targetDate });
			await batchFactory.create({ executedAt: new Date(2026, 8, 26) });

			const { batches } = await repository.fetchList({
				executedAt: targetDate,
			});

			expect(batches).toHaveLength(1);
			expect(
				batches.every(
					(batch) => batch.executedAt.getTime() === targetDate.getTime(),
				),
			).toBe(true);
		});

		it("statusで指定したbatchレコードが取得できること", async () => {
			const targetState = "running";
			await batchFactory.create({ status: targetState });
			await batchFactory.create({ status: "success" });

			const { batches } = await repository.fetchList({
				status: targetState,
			});

			expect(batches).toHaveLength(1);
			expect(batches.every((batch) => batch.status === targetState)).toBe(true);
		});

		it("sort（昇順）で指定したソート順でbatchレコードが取得できること", async () => {
			const createdBatches = [];
			for (let i = 0; i < 3; i++) {
				createdBatches.push(await batchFactory.create());
			}

			const { batches } = await repository.fetchList({ sort: "asc" });

			// idはuuid7（時系列でソート可能）なので、作成順がidの昇順と一致する
			expect(batches.map((batch) => batch.id)).toEqual(
				createdBatches.map((batch) => batch.id),
			);
		});

		it("sort（降順）で指定したソート順でbatchレコードが取得できること", async () => {
			const createdBatches = [];
			for (let i = 1; i < 3; i++) {
				createdBatches.push(await batchFactory.create());
			}

			const { batches } = await repository.fetchList({ sort: "desc" });

			// idはuuid7（時系列でソート可能）なので、作成順の逆がidの降順と一致する
			expect(batches.map((batch) => batch.id)).toEqual(
				createdBatches.map((batch) => batch.id).reverse(),
			);
		});

		describe("ページネーションの境界値テスト", () => {
			it("該当レコード数がlimitと一致する場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetCount = 10;
				await batchFactory.createList(targetCount);
				const { batches, lastCursor } = await repository.fetchList({
					limit: targetCount,
				});

				expect(batches).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより少ない場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetCount = 9;
				await batchFactory.createList(targetCount);
				const { batches, lastCursor } = await repository.fetchList({
					limit: 10,
				});

				expect(batches).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより多い場合、limit件に切り詰められて、次ページがある判定（lastCursorが存在する）がされること", async () => {
				const targetCount = 11;
				await batchFactory.createList(targetCount);
				const { batches, lastCursor } = await repository.fetchList({
					limit: 10,
				});

				expect(batches).toHaveLength(10);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(batches.at(-1)?.id);
			});

			it("limitで指定しなかった場合、かつ該当レコード数がlimitより多い場合、デフォルト値の10件に切り詰められてbatchレコードが取得できること", async () => {
				const targetCount = 11;
				await batchFactory.createList(targetCount);

				const { batches, lastCursor } = await repository.fetchList({});

				expect(batches).toHaveLength(10);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(batches.at(-1)?.id);
			});
		});
	});
	describe("createテスト", () => {
		it("batchレコードが新規作成されること", async () => {
			const user = await userFactory.create();
			const newBatch = batchFactory.build({ triggeredBy: user.id });

			const createdBatch = await repository.create(newBatch);

			expect(createdBatch.id).toBeDefined();
			expect(createdBatch.triggerType).toBe(newBatch.triggerType);
			expect(createdBatch.triggeredBy).toBe(user.id);
			expect(createdBatch.executedAt).toEqual(newBatch.executedAt);
			expect(createdBatch.status).toBe(newBatch.status);

			const found = await repository.findById(createdBatch.id ?? "");
			expect(found?.id).toBe(createdBatch.id);
		});

		it("triggeredByに存在しないユーザーIDを指定した場合、エラーになること", async () => {
			const newBatch = batchFactory.build({ triggeredBy: "存在しないID" });

			await expect(repository.create(newBatch)).rejects.toThrow();
		});
	});
});
