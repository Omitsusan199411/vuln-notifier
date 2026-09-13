import { beforeEach, describe, expect, it } from "vitest";
import { NotificationChannel } from "@/domain/notification-channel/entity.js";
import type { ReconstructedNotificationChannelProps } from "@/domain/notification-channel/entity.type.js";
import { NotificationChannelType } from "@/generated/prisma/enums.js";
import { PrismaNotificationChannelRepository } from "@/infrastructure/prisma/notification-channel/repositoty.js";
import { newNotificationChannelPropsFactory } from "@/testing/factories/notification-channel.js";
import { notificationChannelFactory } from "@/testing/factories/persisted/notification-channel.js";
import { userFactory } from "@/testing/factories/persisted/user.js";

describe("Prisma Notification Channel Integration Test", () => {
	let repository: PrismaNotificationChannelRepository;

	beforeEach(() => {
		repository = new PrismaNotificationChannelRepository();
	});

	describe("findByIdメソッド", () => {
		it("指定したnotificationChannelIdを持つNotificationChannelレコードが取得できること", async () => {
			const createdNotificationChannel =
				await notificationChannelFactory.create();
			const foundNotificationChannel = await repository.findById(
				createdNotificationChannel.id,
			);

			expect(foundNotificationChannel).not.toBeNull();
			expect(foundNotificationChannel?.id).toBe(createdNotificationChannel.id);
		});

		it("NotificartionChannelテーブルに存在しないnotificationChannelIdを指定した場合、nullを返すこと", async () => {
			const dummyNotificationChannelId = "dummyId";

			await notificationChannelFactory.createList(5);

			const foundNotificationChannel = await repository.findById(
				dummyNotificationChannelId,
			);

			expect(foundNotificationChannel).toBeNull();
		});
	});

	describe("fetchListメソッド", () => {
		it("cursorで指定した場合、指定したIDの次のIDのnotificationChannelレコードが取得されること", async () => {
			await notificationChannelFactory.createList(5);

			// factoryが生成した配列の順番とDBが返す順番が一致する保証はないため、fetchList({})の実際の返却順を期待値の基準にする
			const { notificationChannels: allNotificationChannels } =
				await repository.fetchList({});
			const cursorIndex = 1; // cursorの対象をallNotificationChannnelの２番目の要素に指定
			const cursor = allNotificationChannels[cursorIndex].id;

			const { notificationChannels: targetNotificationChannels } =
				await repository.fetchList({
					cursor,
				});

			expect(
				targetNotificationChannels.map(
					(notificationChannel) => notificationChannel.id,
				),
			).toEqual(
				allNotificationChannels
					.slice(cursorIndex + 1)
					.map((notificationChannel) => notificationChannel.id),
			);
		});

		it("cursorで指定しない場合は、先頭ページのnotificationChannelレコードから取得されること", async () => {
			const targetLimit = 10;
			const createdNotificationChannels = [];
			// createListは内部でPromise.all（並列）で作成するため作成順の保証がない。逐次awaitで作成順を保証する
			for (let i = 0; i <= targetLimit; i++) {
				createdNotificationChannels.push(
					await notificationChannelFactory.create(),
				);
			}

			const { notificationChannels } = await repository.fetchList({
				limit: targetLimit,
				sort: "asc",
			});

			expect(notificationChannels).toHaveLength(targetLimit);
			expect(
				notificationChannels.map(
					(notificationChannel) => notificationChannel.id,
				),
			).toEqual(
				createdNotificationChannels
					.slice(0, targetLimit)
					.map((notificationChannel) => notificationChannel.id),
			);
		});

		it("userIdで指定したnotificationChannelレコードが取得できること", async () => {
			const { id: targetUserId } = await userFactory.create();
			const targetCount = 2;
			await notificationChannelFactory.createList(targetCount, {
				userId: targetUserId,
			});

			const { notificationChannels } = await repository.fetchList({
				userId: targetUserId,
			});

			expect(notificationChannels).toHaveLength(targetCount);
			expect(
				notificationChannels.every(
					(notificationChannel) => notificationChannel.userId === targetUserId,
				),
			).toBe(true);
		});

		it("typeで指定したnotificationChannelレコードが取得できること", async () => {
			const type = NotificationChannelType.line;
			const targetCount = 2;
			await notificationChannelFactory.createList(targetCount, {
				type,
			});

			const { notificationChannels } = await repository.fetchList({
				type,
				sort: "asc",
			});

			expect(notificationChannels).toHaveLength(targetCount);
			expect(
				notificationChannels.every(
					(notificationChannel) => notificationChannel.type === type,
				),
			).toBe(true);
		});

		it("enabledで指定したnotificationChannelレコードが取得できること", async () => {
			const enabled = true;
			const targetCount = 2;
			await notificationChannelFactory.createList(targetCount, {
				enabled,
			});

			const { notificationChannels } = await repository.fetchList({
				enabled,
				sort: "asc",
			});

			expect(notificationChannels).toHaveLength(targetCount);
			expect(
				notificationChannels.every(
					(notificationChannel) => notificationChannel.enabled === enabled,
				),
			).toBe(true);
		});

		it("sort（昇順）で指定したソート順でnotificationChannelレコードが取得できること", async () => {
			const sort = "asc";
			const createdNotificationChannels = [];
			for (let i = 0; i < 3; i++) {
				createdNotificationChannels.push(
					await notificationChannelFactory.create(),
				);
			}
			const { notificationChannels } = await repository.fetchList({
				sort,
			});

			expect(
				notificationChannels.map(
					(notificationChannel) => notificationChannel.id,
				),
			).toEqual(
				createdNotificationChannels.map(
					(notificationChannel) => notificationChannel.id,
				),
			);
		});

		it("sort（降順）で指定したソート順でnotificationChannelレコードが取得できること", async () => {
			const sort = "desc";
			const createdNotificationChannels = [];
			for (let i = 0; i < 3; i++) {
				createdNotificationChannels.push(
					await notificationChannelFactory.create(),
				);
			}
			const { notificationChannels } = await repository.fetchList({
				sort,
			});

			expect(
				notificationChannels.map(
					(notificationChannel) => notificationChannel.id,
				),
			).toEqual(
				createdNotificationChannels
					.map((notificationChannel) => notificationChannel.id)
					.reverse(),
			);
		});

		describe("ページングの判定", () => {
			it("該当レコード数がlimitと一致する場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetCount = 10;

				await notificationChannelFactory.createList(targetCount);

				const { notificationChannels, lastCursor } = await repository.fetchList(
					{
						limit: targetCount,
					},
				);

				expect(notificationChannels).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより少ない場合、次ページがない判定（lastCursorがnull）がされること", async () => {
				const targetCount = 9;

				await notificationChannelFactory.createList(targetCount);

				const { notificationChannels, lastCursor } = await repository.fetchList(
					{
						limit: 10,
					},
				);

				expect(notificationChannels).toHaveLength(targetCount);
				expect(lastCursor).toBeNull();
			});

			it("該当レコード数がlimitより多い場合、limit件に切り詰められて、次ページがある判定（lastCursorが存在する）がされること", async () => {
				const targetCount = 11;
				const targetLimit = 10;

				await notificationChannelFactory.createList(targetCount);

				const { notificationChannels, lastCursor } = await repository.fetchList(
					{
						limit: targetLimit,
					},
				);

				expect(notificationChannels).toHaveLength(targetLimit);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(notificationChannels.at(-1)?.id);
			});

			it("limitで指定しなかった場合、かつ該当レコード数がlimitより多い場合、デフォルト値の10件に切り詰められてnotificationChannelレコードが取得できること", async () => {
				const targetCount = 11;
				const defaultLimit = 10;

				await notificationChannelFactory.createList(targetCount);

				const { notificationChannels, lastCursor } = await repository.fetchList(
					{},
				);

				expect(notificationChannels).toHaveLength(defaultLimit);
				expect(lastCursor).not.toBeNull();
				expect(lastCursor).toEqual(notificationChannels.at(-1)?.id);
			});
		});
	});

	describe("createメソッド", () => {
		it("notificationChannelレコードが新規作成されること", async () => {
			const createdUser = await userFactory.create();
			const newNotificationChannel = newNotificationChannelPropsFactory.build({
				userId: createdUser.id,
			});
			const notificationChannel = NotificationChannel.create(
				newNotificationChannel,
			);

			const createdNotificationChannel =
				await repository.create(notificationChannel);

			const {
				userId,
				type,
				maxNotificationLimit,
				enabled,
				minSeverity,
				minCvssScore,
				cvssScoreOrderBy,
				notificationIntervalMinutes,
				lastProcessedAt,
			} = notificationChannel;

			expect(createdNotificationChannel.id).toBeDefined();
			expect(createdNotificationChannel.userId).toBe(userId);
			expect(createdNotificationChannel.type).toBe(type);
			expect(createdNotificationChannel.maxNotificationLimit).toBe(
				maxNotificationLimit,
			);
			expect(createdNotificationChannel.enabled).toBe(enabled);
			expect(createdNotificationChannel.minSeverity).toBe(minSeverity);
			expect(createdNotificationChannel.minCvssScore).toBe(minCvssScore);
			expect(createdNotificationChannel.cvssScoreOrderBy).toBe(
				cvssScoreOrderBy,
			);
			expect(createdNotificationChannel.notificationIntervalMinutes).toBe(
				notificationIntervalMinutes,
			);
			expect(createdNotificationChannel.lastProcessedAt).toEqual(
				lastProcessedAt,
			);
		});
	});

	describe("updateメソッド", () => {
		it("指定したnotificationChannelレコードを任意の値で更新できること", async () => {
			const targetParams: Partial<ReconstructedNotificationChannelProps> = {
				minSeverity: "medium",
			};
			const createdNotificationChannel =
				await notificationChannelFactory.create();
			const reconstructedNotificationChannel = NotificationChannel.reconstruct({
				...createdNotificationChannel,
				...targetParams,
			});

			const updatedNotificationChannel = await repository.update(
				reconstructedNotificationChannel,
			);

			expect(updatedNotificationChannel.minSeverity).toBe(
				targetParams.minSeverity,
			);
		});
	});

	describe("deleteByIdメソッド", () => {
		it("指定したnotificationChannelIdを持つNotificationChannelレコードが削除されること", async () => {
			const createdNotificationChannel =
				await notificationChannelFactory.create();
			const targetId = createdNotificationChannel.id;

			await repository.deleteById(targetId);

			const foundNotificationChannel = await repository.findById(targetId);

			expect(foundNotificationChannel).toBeNull();
		});

		it("notificationChannelテーブルに存在しないnotificationChannelIdを指定した場合、エラーになること", async () => {
			const dummyNotificationChannelId = "dummyId";

			await expect(
				repository.deleteById(dummyNotificationChannelId),
			).rejects.toThrow();
		});
	});
});
