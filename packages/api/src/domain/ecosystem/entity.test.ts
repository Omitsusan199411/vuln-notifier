import { beforeAll, describe, expect, it } from "vitest";
import { Ecosystem } from "@/domain/ecosystem/entity.js";
import type { ReconstructedEcosystemProps } from "@/domain/ecosystem/entity.type.js";
import { reconstructedEcosystemPropsFactory } from "@/testing/factories/ecosystem.js";

describe("Ecosystem Entity Unit Test", () => {
	describe("reconstructメソッド", () => {
		let props: ReconstructedEcosystemProps;
		let ecosystem: Ecosystem;

		beforeAll(() => {
			props = reconstructedEcosystemPropsFactory.build();
			ecosystem = Ecosystem.reconstruct(props);
		});

		it("再構築されたEcosystemインスタンスのプロパティがpropsと一致していること", () => {
			const { id, name } = props;
			expect(ecosystem.id).toBe(id);
			expect(ecosystem.name).toBe(name);
		});
	});
});
