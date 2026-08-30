import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import { User } from "@/domain/user/entity.js";
import { userFactory } from "@/testing/factories/persisted/user.js";
import { newUserPropsFactory } from "@/testing/factories/user.js";
import { PrismaUserRepository } from "./repository.js";

describe("Prisma User Integration Test", () => {
	let repository: PrismaUserRepository;

	beforeEach(() => {
		repository = new PrismaUserRepository();
	});

	describe("findByIdメソッド", () => {
		it("DBに存在するuserIdを渡した場合、該当するUserオブジェクトを返すこと", async () => {
			const createdUser = await userFactory.create();

			const user = await repository.findById(createdUser.id);

			expect(user).not.toBeNull();
			expect(user?.id).toBe(createdUser.id);
		});

		it("DBに存在しないuserIdを渡した場合、nullを返すこと", async () => {
			const dummyUserId = faker.string.uuid({ version: 7 });

			await userFactory.createList(5);

			const user = await repository.findById(dummyUserId);

			expect(user).toBeNull();
		});
	});

	describe("fetchListメソッド", () => {
		it("cursorで指定した場合、指定したIDの次のIDのuserレコードが取得されること", async () => {
			await userFactory.createList(5);

			const { users: allUsers } = await repository.fetchList({});
			const cursorIndex = 1;
			const cursor = allUsers[cursorIndex].id;

			const { users } = await repository.fetchList({
				cursor,
			});

			expect(users.map((user) => user.id)).toEqual(
				allUsers.slice(cursorIndex + 1).map((user) => user.id),
			);
		});

		it("cursorで指定しない場合は、先頭ページのusersレコードから取得されること", async () => {
			const targetLimit = 10;
			const createdUsers = [];

			for (let i = 0; i < 10; i++) {
				createdUsers.push(await userFactory.create());
			}

			const { users } = await repository.fetchList({
				limit: targetLimit,
				sort: "asc",
			});

			expect(users).toHaveLength(targetLimit);
			expect(users.map((user) => user.id)).toEqual(
				createdUsers.slice(0, 10).map((user) => user.id),
			);
		});

		it("sort（昇順）で指定したソート順でuserレコードが取得できること", async () => {
			const createUsers = [];
			for (let i = 0; i < 3; i++) {
				createUsers.push(await userFactory.create());
			}

			const { users } = await repository.fetchList({ sort: "asc" });

			// idはuuid7（時系列でソート可能）なので、作成順がidの昇順と一致する
			expect(users.map((batch) => batch.id)).toEqual(
				createUsers.map((batch) => batch.id),
			);
		});

		it("sort（降順）で指定したソート順でuserレコードが取得できること", async () => {
			const createUsers = [];
			for (let i = 1; i < 3; i++) {
				createUsers.push(await userFactory.create());
			}

			const { users } = await repository.fetchList({ sort: "desc" });

			// idはuuid7（時系列でソート可能）なので、作成順の逆がidの降順と一致する
			expect(users.map((batch) => batch.id)).toEqual(
				createUsers.map((batch) => batch.id).reverse(),
			);
		});

		describe("ページネーションの境界値テスト", () => {
			it("該当レコード数がlimitと一致する場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetCount = 10;
				await userFactory.createList(targetCount);
				const { users, lastCursor } = await repository.fetchList({
					limit: targetCount,
				});

				expect(users).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより少ない場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetCount = 9;
				await userFactory.createList(targetCount);
				const { users, lastCursor } = await repository.fetchList({
					limit: 10,
				});

				expect(users).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより多い場合、limit件に切り詰められて、次ページがある判定（lastCursorが存在する）がされること", async () => {
				const targetCount = 11;
				await userFactory.createList(targetCount);
				const { users, lastCursor } = await repository.fetchList({
					limit: 10,
				});

				expect(users).toHaveLength(10);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(users.at(-1)?.id);
			});

			it("limitで指定しなかった場合、かつ該当レコード数がlimitより多い場合、デフォルト値の10件に切り詰められてbatchレコードが取得できること", async () => {
				const targetCount = 11;
				await userFactory.createList(targetCount);

				const { users, lastCursor } = await repository.fetchList({});

				expect(users).toHaveLength(10);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(users.at(-1)?.id);
			});
		});
	});
	describe("createメソッド", () => {
		it("渡したUserドメインのパラメータに従ってuserレコードがDBに登録されること", async () => {
			const newUserProps = newUserPropsFactory.build();
			const newUser = User.create(newUserProps);
			const user = await repository.create(newUser);

			expect(user.id).toBeDefined();
			expect(user.cognitoSub).toBe(newUser.cognitoSub);
		});
	});
});
