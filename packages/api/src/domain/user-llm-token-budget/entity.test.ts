import { beforeAll, describe, expect, it } from "vitest";
import { UserLlmTokenBudget } from "@/domain/user-llm-token-budget/entity.js";
import type {
	NewUserLlmTokenBudgetProps,
	ReconstructedUserLlmTokenBudgetProps,
} from "@/domain/user-llm-token-budget/entity.type.js";
import {
	newUserLlmTokenBudgetPropsFactory,
	reconstructedUserLlmTokenBudgetPropsFactory,
} from "@/testing/factories/user-llm-token-budget.js";

describe("UserLlmTokenBudget Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewUserLlmTokenBudgetProps;
		let userLlmTokenBudget: UserLlmTokenBudget;

		beforeAll(() => {
			props = newUserLlmTokenBudgetPropsFactory.build();
			userLlmTokenBudget = UserLlmTokenBudget.create(props);
		});

		it("新たに作成したUserLlmTokenBudgetインスタンスが持つプロパティがpropsと一致すること", () => {
			const { userId, monthlyTokenBudget } = props;
			expect(userLlmTokenBudget.userId).toBe(userId);
			expect(userLlmTokenBudget.monthlyTokenBudget).toBe(monthlyTokenBudget);
		});

		it("idがundefinedであること", () => {
			expect(userLlmTokenBudget.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedUserLlmTokenBudgetProps;
		let userLlmTokenBudget: UserLlmTokenBudget;

		beforeAll(() => {
			props = reconstructedUserLlmTokenBudgetPropsFactory.build();
			userLlmTokenBudget = UserLlmTokenBudget.reconstruct(props);
		});

		it("再構築したUserLlmTokenBudgetインスタンスが持つプロパティがpropsと一致すること", () => {
			const { userId, monthlyTokenBudget } = props;
			expect(userLlmTokenBudget.userId).toBe(userId);
			expect(userLlmTokenBudget.monthlyTokenBudget).toBe(monthlyTokenBudget);
		});
	});
});
