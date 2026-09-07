import { beforeAll, describe, expect, it } from "vitest";
import { Notification } from "@/domain/notification/entity.js";
import type {
	NewNotificationProps,
	ReconstructedNotificationProps,
} from "@/domain/notification/entity.type.js";
import {
	newNotificationPropsFactory,
	reconstructedNotificationPropsFactory,
} from "@/testing/factories/notification.js";

describe("Notification Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewNotificationProps;
		let notification: Notification;

		beforeAll(() => {
			props = newNotificationPropsFactory.build();
			notification = Notification.create(props);
		});

		it("新たに作成したNotificationインスタンスが持つプロパティがpropsと一致すること", () => {
			const { notificationChannelId, vulnerabilityId, notifiedAt } = props;
			expect(notification.notificationChannelId).toBe(notificationChannelId);
			expect(notification.vulnerabilityId).toBe(vulnerabilityId);
			expect(notification.notifiedAt).toBe(notifiedAt);
		});

		it("idはundefinedであること", () => {
			expect(notification.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedNotificationProps;
		let notification: Notification;

		beforeAll(() => {
			props = reconstructedNotificationPropsFactory.build();
			notification = Notification.reconstruct(props);
		});

		it("再構築したNotificationインスタンスが持つプロパティがpropsと一致すること", () => {
			const { id, notificationChannelId, vulnerabilityId, notifiedAt } = props;
			expect(notification.id).toBe(id);
			expect(notification.notificationChannelId).toBe(notificationChannelId);
			expect(notification.vulnerabilityId).toBe(vulnerabilityId);
			expect(notification.notifiedAt).toBe(notifiedAt);
		});
	});
});
