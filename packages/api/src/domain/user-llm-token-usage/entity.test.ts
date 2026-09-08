import { beforeAll, describe, expect, it } from "vitest";
import { UserLlmTokenUsage } from "@/domain/user-llm-token-usage/entity.js";
import type {
	NewUserLlmTokenUsageProps,
	ReconstructedUserLlmTokenUsageProps,
} from "@/domain/user-llm-token-usage/entity.type.js";
import {
	newUserLlmTokenUsagePropsFactory,
	reconstructedUserLlmTokenUsagePropsFactory,
} from "@/testing/factories/user-llm-token-usage.js";

describe("UserLlmTokenUsage Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewUserLlmTokenUsageProps;
		let userLlmTokenUsage: UserLlmTokenUsage;

		beforeAll(() => {
			props = newUserLlmTokenUsagePropsFactory.build();
			userLlmTokenUsage = UserLlmTokenUsage.create(props);
		});

		it("新たに作成したUserLlmTokenUsageインスタンスが持つプロパティがpropsと一致すること", () => {
			const { userId, year, month, modelId, inputTokens, outputTokens } = props;
			expect(userLlmTokenUsage.userId).toBe(userId);
			expect(userLlmTokenUsage.year).toBe(year);
			expect(userLlmTokenUsage.month).toBe(month);
			expect(userLlmTokenUsage.modelId).toBe(modelId);
			expect(userLlmTokenUsage.inputTokens).toBe(inputTokens);
			expect(userLlmTokenUsage.outputTokens).toBe(outputTokens);
		});

		it("idはundefinedであること", () => {
			expect(userLlmTokenUsage.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedUserLlmTokenUsageProps;
		let userLlmTokenUsage: UserLlmTokenUsage;

		beforeAll(() => {
			props = reconstructedUserLlmTokenUsagePropsFactory.build();
			userLlmTokenUsage = UserLlmTokenUsage.reconstruct(props);
		});

		it("再構築したUserLlmTokenUsageインスタンスが持つプロパティがpropsと一致すること", () => {
			const { id, userId, year, month, modelId, inputTokens, outputTokens } =
				props;
			expect(userLlmTokenUsage.id).toBe(id);
			expect(userLlmTokenUsage.userId).toBe(userId);
			expect(userLlmTokenUsage.year).toBe(year);
			expect(userLlmTokenUsage.month).toBe(month);
			expect(userLlmTokenUsage.modelId).toBe(modelId);
			expect(userLlmTokenUsage.inputTokens).toBe(inputTokens);
			expect(userLlmTokenUsage.outputTokens).toBe(outputTokens);
		});
	});
});
