import { beforeAll, describe, expect, it } from "vitest";
import { Batch } from "@/domain/batch/entity.js";
import type {
	NewBatchProps,
	ReconstructedBatchProps,
} from "@/domain/batch/entity.type.js";
import {
	createNewBatchProps,
	createReconstructedBatchProps,
} from "@/testing/factories/batch.js";

describe("Batch Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewBatchProps;
		let batch: Batch;

		beforeAll(() => {
			props = createNewBatchProps({});
			batch = Batch.create(props);
		});

		it("作成されたBatchインスタンスのプロパティがpropsと一致していること", () => {
			const { triggerType, triggeredBy, executedAt, status } = props;
			expect(batch.triggerType).toBe(triggerType);
			expect(batch.triggeredBy).toBe(triggeredBy);
			expect(batch.executedAt).toBe(executedAt);
			expect(batch.status).toBe(status);
		});

		it("idはundefinedであること", () => {
			expect(batch.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedBatchProps;
		let batch: Batch;

		beforeAll(() => {
			props = createReconstructedBatchProps({});
			batch = Batch.reconstruct(props);
		});

		it("再構築されたBatchインスタンスのプロパティがpropsと一致していること", () => {
			const { id, triggerType, triggeredBy, executedAt, status } = props;
			expect(batch.id).toBe(id);
			expect(batch.triggerType).toBe(triggerType);
			expect(batch.triggeredBy).toBe(triggeredBy);
			expect(batch.executedAt).toBe(executedAt);
			expect(batch.status).toBe(status);
		});
	});

	describe("updateStatusメソッド", () => {
		it("pendingに更新されること", () => {
			const batch = Batch.reconstruct(
				createReconstructedBatchProps({ status: "failed" }),
			);
			const assertStatus = "pending";
			batch.updateStatus(assertStatus);
			expect(batch.status).toBe(assertStatus);
		});
		it("runnningに更新されること", () => {
			const batch = Batch.reconstruct(
				createReconstructedBatchProps({ status: "pending" }),
			);
			const assertStatus = "running";
			batch.updateStatus(assertStatus);
			expect(batch.status).toBe(assertStatus);
		});
		it("successに更新されること", () => {
			const batch = Batch.reconstruct(
				createReconstructedBatchProps({ status: "running" }),
			);
			const assertStatus = "success";
			batch.updateStatus(assertStatus);
			expect(batch.status).toBe(assertStatus);
		});
		it("failedに更新されること", () => {
			const batch = Batch.reconstruct(
				createReconstructedBatchProps({ status: "running" }),
			);
			const assertStatus = "failed";
			batch.updateStatus(assertStatus);
			expect(batch.status).toBe(assertStatus);
		});
	});
});
