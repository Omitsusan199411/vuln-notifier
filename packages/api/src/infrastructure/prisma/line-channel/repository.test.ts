import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import { LineChannel } from "@/domain/line-channel/entity.js";
import { PrismaLineChannelRepository } from "@/infrastructure/prisma/line-channel/repository.js";
import prisma from "@/lib/prisma.js";
import { lineChannelFactory } from "@/testing/factories/persisted/line-channel.js";
import { notificationChannelFactory } from "@/testing/factories/persisted/notification-channel.js";

describe("Prisma LineChannel Integration Test", () => {
	let repository: PrismaLineChannelRepository;

	beforeEach(() => {
		repository = new PrismaLineChannelRepository();
	});

	describe("findByNotificationChannelIdメソッド", () => {
		it("指定したnotificationChannelIdを持つLineChannelレコードが取得できること", async () => {
			const createdLineChannel = await lineChannelFactory.create();
			const foundLineChannel = await repository.findByNotificationChannelId(
				createdLineChannel.notificationChannelId,
			);

			expect(foundLineChannel).not.toBeNull();
			expect(foundLineChannel?.id).toBe(createdLineChannel.id);
			expect(foundLineChannel?.notificationChannelId).toBe(
				createdLineChannel.notificationChannelId,
			);
			expect(foundLineChannel?.lineUserId).toBe(createdLineChannel.lineUserId);
		});

		it("指定したnotificationChannelIdがLineChannelレコードに存在しない場合はnullを返すこと", async () => {
			const dummyNotificationChannelId = faker.string.nanoid();

			const foundLineChannel = await repository.findByNotificationChannelId(
				dummyNotificationChannelId,
			);

			expect(foundLineChannel).toBeNull();
		});
	});

	describe("createメソッド", () => {
		it("lineChannelレコードが新規作成されること", async () => {
			const notificationChannel = await notificationChannelFactory.create();
			const newLineChannel = LineChannel.create(
				lineChannelFactory.build({
					notificationChannelId: notificationChannel.id,
				}),
			);

			const createdLineChannel = await repository.create(newLineChannel);

			expect(createdLineChannel.id).toBeDefined();
			expect(createdLineChannel.notificationChannelId).toBe(
				newLineChannel.notificationChannelId,
			);
			expect(createdLineChannel.lineUserId).toBe(newLineChannel.lineUserId);
		});

		it("notificationChannelIdに存在しないチャンネルIDを指定した場合、エラーになること", async () => {
			const newLineChannnel = LineChannel.create(
				lineChannelFactory.build({ notificationChannelId: "存在しないID" }),
			);

			await expect(repository.create(newLineChannnel)).rejects.toThrow();
		});
	});

	describe("deleteメソッド", () => {
		it("指定したlineChannelIdを持つLineChannelレコードが削除されること", async () => {
			const createdLineChannel = await lineChannelFactory.create();

			await repository.deleteById(createdLineChannel.id);

			const foundLineChannel = await prisma.lineChannel.findUnique({
				where: { id: createdLineChannel.id },
			});

			expect(foundLineChannel).toBeNull();
		});

		it("LineChannelレコードに存在しないlineChannelIdを指定した場合、エラーになること", async () => {
			await lineChannelFactory.create();
			const dummyLineChannelId = faker.string.nanoid();

			await expect(repository.deleteById(dummyLineChannelId)).rejects.toThrow();
		});

		it("指定していないlineChannelIdを持つLineChannelレコードは削除されないこと", async () => {
			const expectedLineChannel = await lineChannelFactory.create();
			const deletedTargetLineChannel = await lineChannelFactory.create();

			await repository.deleteById(deletedTargetLineChannel.id);

			const foundLineChannels = await prisma.lineChannel.findUnique({
				where: { id: expectedLineChannel.id },
			});

			expect(foundLineChannels).not.toBeNull();
			expect(foundLineChannels?.id).toBe(expectedLineChannel.id);
			expect(foundLineChannels?.notificationChannelId).toBe(
				expectedLineChannel.notificationChannelId,
			);
			expect(foundLineChannels?.lineUserId).toBe(
				expectedLineChannel.lineUserId,
			);
		});
	});
});
