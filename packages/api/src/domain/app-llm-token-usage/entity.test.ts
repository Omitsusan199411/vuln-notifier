import { beforeAll, describe, expect, it } from "vitest";
import { AppLlmTokenUsage } from "@/domain/app-llm-token-usage/entity.js";
import type {
	NewAppLlmTokenUsageProps,
	ReconstructedAppLlmTokenUsageProps,
} from "@/domain/app-llm-token-usage/entity.type.js";
import {
	newAppLlmTokenUsagePropsFactory,
	reconstructedAppLlmTokenUsagePropsFactory,
} from "@/testing/factories/app-llm-token-usage.js";

describe("AppLlmTokenUsage Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewAppLlmTokenUsageProps;
		let appLlmTokenUsage: AppLlmTokenUsage;

		beforeAll(() => {
			props = newAppLlmTokenUsagePropsFactory.build();
			appLlmTokenUsage = AppLlmTokenUsage.create(props);
		});

		it("新たに作成したAppLlmTokenUsageインスタンスが持つプロパティがpropsと一致すること", () => {
			const { year, month, modelId, inputTokens, outputTokens } = props;
			expect(appLlmTokenUsage.year).toBe(year);
			expect(appLlmTokenUsage.month).toBe(month);
			expect(appLlmTokenUsage.modelId).toBe(modelId);
			expect(appLlmTokenUsage.inputTokens).toBe(inputTokens);
			expect(appLlmTokenUsage.outputTokens).toBe(outputTokens);
		});

		it("idはundefinedであること", () => {
			expect(appLlmTokenUsage.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedAppLlmTokenUsageProps;
		let appLlmTokenUsage: AppLlmTokenUsage;

		beforeAll(() => {
			props = reconstructedAppLlmTokenUsagePropsFactory.build();
			appLlmTokenUsage = AppLlmTokenUsage.reconstruct(props);
		});

		it("再構築したAppLlmTokenUsageインスタンスが持つプロパティがpropsと一致すること", () => {
			const { id, year, month, modelId, inputTokens, outputTokens } = props;
			expect(appLlmTokenUsage.id).toBe(id);
			expect(appLlmTokenUsage.year).toBe(year);
			expect(appLlmTokenUsage.month).toBe(month);
			expect(appLlmTokenUsage.modelId).toBe(modelId);
			expect(appLlmTokenUsage.inputTokens).toBe(inputTokens);
			expect(appLlmTokenUsage.outputTokens).toBe(outputTokens);
		});
	});
});
