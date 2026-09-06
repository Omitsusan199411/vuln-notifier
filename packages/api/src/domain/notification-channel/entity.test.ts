import { beforeAll, describe, expect, it } from "vitest";
import { NotificationChannel } from "@/domain/notification-channel/entity.js";
import type {
	NewNotificationChannelProps,
	ReconstructedNotificationChannelProps,
} from "@/domain/notification-channel/entity.type.js";
import {
	newNotificationChannelPropsFactory,
	reconstructedNotificationChannelPropsFactory,
} from "@/testing/factories/notification-channel.js";

describe("Notification Channel Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewNotificationChannelProps;
		let notificationChannel: NotificationChannel;

		beforeAll(() => {
			props = newNotificationChannelPropsFactory.build();
			notificationChannel = NotificationChannel.create(props);
		});

		it("作成されたNotificationChannelインスタンスのプロパティがpropsと一致していること", () => {
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
			} = props;
			expect(notificationChannel.userId).toBe(userId);
			expect(notificationChannel.type).toBe(type);
			expect(notificationChannel.maxNotificationLimit).toBe(
				maxNotificationLimit,
			);
			expect(notificationChannel.enabled).toBe(enabled);
			expect(notificationChannel.minSeverity).toBe(minSeverity);
			expect(notificationChannel.minCvssScore).toBe(minCvssScore);
			expect(notificationChannel.cvssScoreOrderBy).toBe(cvssScoreOrderBy);
			expect(notificationChannel.notificationIntervalMinutes).toBe(
				notificationIntervalMinutes,
			);
			expect(notificationChannel.lastProcessedAt).toBe(lastProcessedAt);
		});

		it("NotificationChannelインスタンスのidプロパティがundefinedであること", () => {
			expect(notificationChannel.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedNotificationChannelProps;
		let notificationChannel: NotificationChannel;

		beforeAll(() => {
			props = reconstructedNotificationChannelPropsFactory.build();
			notificationChannel = NotificationChannel.reconstruct(props);
		});

		it("再構築されたNotificationChannelインスタンスのプロパティがpropsと一致していること", () => {
			const {
				id,
				userId,
				type,
				maxNotificationLimit,
				enabled,
				minSeverity,
				minCvssScore,
				cvssScoreOrderBy,
				notificationIntervalMinutes,
				lastProcessedAt,
			} = props;
			expect(notificationChannel.id).toBe(id);
			expect(notificationChannel.userId).toBe(userId);
			expect(notificationChannel.type).toBe(type);
			expect(notificationChannel.maxNotificationLimit).toBe(
				maxNotificationLimit,
			);
			expect(notificationChannel.enabled).toBe(enabled);
			expect(notificationChannel.minSeverity).toBe(minSeverity);
			expect(notificationChannel.minCvssScore).toBe(minCvssScore);
			expect(notificationChannel.cvssScoreOrderBy).toBe(cvssScoreOrderBy);
			expect(notificationChannel.notificationIntervalMinutes).toBe(
				notificationIntervalMinutes,
			);
			expect(notificationChannel.lastProcessedAt).toBe(lastProcessedAt);
		});
	});
	describe("isDueAtメソッド", () => {
		it("一度も通知処理をしていないチャネルは、通知対象と判定されること", () => {
			const props = reconstructedNotificationChannelPropsFactory.build({
				lastProcessedAt: null,
			});
			const notificationChannel = NotificationChannel.reconstruct(props);
			const now = new Date();

			expect(notificationChannel.isDueAt(now)).toBe(true);
		});

		it("設定した通知間隔がまだ経過しているチャネルは、通知対象と判定されること", () => {
			const now = new Date(); // 現在の日時
			const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 現在の日時から24時間前の日時
			const intervalMinutes = 24 * 60; // 1日のインターバル設定（分）

			const props = reconstructedNotificationChannelPropsFactory.build({
				lastProcessedAt: yesterday,
				notificationIntervalMinutes: intervalMinutes,
			});
			const notificationChannel = NotificationChannel.reconstruct(props);

			expect(notificationChannel.isDueAt(now)).toBe(true);
		});

		it("設定した通知間隔がまだ経過していないチャネルは、通知対象外と判定されること", () => {
			const now = new Date(); // 現在の日時
			const intervalMinutes = 24 * 60; // 1日のインターバル設定（分）
			const lastProcessedAt = new Date(
				now.getTime() - intervalMinutes * 60 * 1000 + 1,
			); // 間隔に1ミリ秒だけ足りない時点（まだ経過していない境界値）

			const props = reconstructedNotificationChannelPropsFactory.build({
				lastProcessedAt,
				notificationIntervalMinutes: intervalMinutes,
			});
			const notificationChannel = NotificationChannel.reconstruct(props);

			expect(notificationChannel.isDueAt(now)).toBe(false);
		});
	});
});
