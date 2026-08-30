import { beforeAll, describe, expect, it } from "vitest";
import {
	newUserPropsFactory,
	reconstructedUserPropsFactory,
} from "@/testing/factories/user.js";
import { User } from "./entity.js";
import type { NewUserProps, ReconstructedUserProps } from "./entity.type.js";

describe("User Entity Unit Test", () => {
	describe("createメソッド", () => {
		let props: NewUserProps;
		let user: User;

		beforeAll(() => {
			props = newUserPropsFactory.build();
			user = User.create(props);
		});

		it("作成されたUserインスタンスのプロパティがpropsと一致していること", () => {
			const { cognitoSub } = props;
			expect(user.cognitoSub).toBe(cognitoSub);
		});

		it("idはundefinedであること", () => {
			expect(user.id).toBeUndefined();
		});
	});

	describe("reconstructメソッド", () => {
		let props: ReconstructedUserProps;
		let user: User;

		beforeAll(() => {
			props = reconstructedUserPropsFactory.build();
			user = User.reconstruct(props);
		});

		it("再構築されたUserインスタンスのプロパティがpropsと一致していること", () => {
			const { id, cognitoSub } = props;

			expect(user.id).toBe(id);
			expect(user.cognitoSub).toBe(cognitoSub);
		});
	});
});
