import { beforeAll, describe, expect, it } from "vitest";
import { LineChannel } from "@/domain/line-channel/entity.js";
import type {
	NewLineChannelProps,
	ReconstructedLineChannelProps,
} from "@/domain/line-channel/entity.type.js";
import {
	newLineChannelPropsFactory,
	reconstructedLineChannelPropsFactory,
} from "@/testing/factories/line-channel.js";

describe("LineChannel Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewLineChannelProps;
		let lineChannel: LineChannel;

		beforeAll(() => {
			props = newLineChannelPropsFactory.build();
			lineChannel = LineChannel.create(props);
		});

		it("新たに作成したLineChannelインスタンスが持つプロパティがpropsと一致すること", () => {
			const { notificationChannelId, lineUserId } = props;
			expect(lineChannel.notificationChannelId).toBe(notificationChannelId);
			expect(lineChannel.lineUserId).toBe(lineUserId);
		});

		it("idはundefinedであること", () => {
			expect(lineChannel.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedLineChannelProps;
		let lineChannel: LineChannel;

		beforeAll(() => {
			props = reconstructedLineChannelPropsFactory.build();
			lineChannel = LineChannel.reconstruct(props);
		});

		it("再構築したLineChannelインスタンスが持つプロパティがpropsと一致すること", () => {
			const { id, notificationChannelId, lineUserId } = props;
			expect(lineChannel.id).toBe(id);
			expect(lineChannel.notificationChannelId).toBe(notificationChannelId);
			expect(lineChannel.lineUserId).toBe(lineUserId);
		});
	});
});
