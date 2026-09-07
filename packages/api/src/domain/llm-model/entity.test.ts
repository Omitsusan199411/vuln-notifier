import { beforeAll, describe, expect, it } from "vitest";
import { LlmModel } from "@/domain/llm-model/entity.js";
import type {
	NewLlmModelProps,
	ReconstructedLlmModelProps,
} from "@/domain/llm-model/entity.type.js";
import {
	newLlmModelPropsFactory,
	reconstructedLlmModelPropsFactory,
} from "@/testing/factories/llm-model.js";

describe("LlmModel Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewLlmModelProps;
		let llmModel: LlmModel;

		beforeAll(() => {
			props = newLlmModelPropsFactory.build();
			llmModel = LlmModel.create(props);
		});

		it("新たに作成したLlmModelインスタンスが持つプロパティがpropsと一致すること", () => {
			const { name, enabled } = props;
			expect(llmModel.name).toBe(name);
			expect(llmModel.enabled).toBe(enabled);
		});

		it("idはundefinedであること", () => {
			expect(llmModel.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedLlmModelProps;
		let llmModel: LlmModel;

		beforeAll(() => {
			props = reconstructedLlmModelPropsFactory.build();
			llmModel = LlmModel.reconstruct(props);
		});

		it("再構築したLlmModelインスタンスが持つプロパティがpropsと一致すること", () => {
			const { id, name, enabled } = props;
			expect(llmModel.id).toBe(id);
			expect(llmModel.name).toBe(name);
			expect(llmModel.enabled).toBe(enabled);
		});
	});
});
