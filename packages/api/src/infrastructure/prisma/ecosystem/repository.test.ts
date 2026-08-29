import { beforeEach, describe, expect, it } from "vitest";
import { EcosystemName } from "@/generated/prisma/enums.js";
import { PrismaEcosystemRepository } from "@/infrastructure/prisma/ecosystem/repository.js";
import { ecosystemFactory } from "@/testing/factories/persisted/ecosystem.js";

describe("Prisma Ecosystem Integration Test", () => {
	let repository: PrismaEcosystemRepository;

	beforeEach(() => {
		repository = new PrismaEcosystemRepository();
	});

	describe("findByNameテスト", () => {
		it("DBに存在するecosystemNameを渡した場合、ecosystemNameで絞り込まれたレコードが取得できること", async () => {
			const targetEcosystemName = EcosystemName.npm;

			const ecosystemNames = Object.values(EcosystemName);

			await Promise.all(
				ecosystemNames.map((ecosystemName) =>
					ecosystemFactory.create({
						name: ecosystemName,
					}),
				),
			);

			const ecosystem = await repository.findByName(targetEcosystemName);

			expect(ecosystem).not.toBeNull();
			expect(ecosystem?.name).toBe(targetEcosystemName);
		});
		it("DBに存在しないecosystemNameを渡した場合、Nullで返ってくること", async () => {
			const unregisteredEcosystemName = EcosystemName.npm;

			await ecosystemFactory.create({
				name: EcosystemName.pip,
			});

			const ecosystem = await repository.findByName(unregisteredEcosystemName);

			expect(ecosystem).toBeNull();
		});
	});

	describe("fetchListメソッド", () => {
		it("登録しているecosystemテーブルのレコードが全て取得できること", async () => {
			const ecosystemNames = Object.values(EcosystemName);
			const targetCount = ecosystemNames.length;

			await Promise.all(
				ecosystemNames.map((ecosystemName) =>
					ecosystemFactory.create({
						name: ecosystemName,
					}),
				),
			);

			const ecosystems = await repository.fetchList();

			expect(ecosystems).toHaveLength(targetCount);
			expect(
				ecosystems.every((ecosystem) =>
					ecosystemNames.includes(ecosystem.name),
				),
			).toBe(true);
		});
	});
});
