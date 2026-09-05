import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewUserProps,
	ReconstructedUserProps,
} from "@/domain/user/entity.type.js";

export const reconstructedUserPropsFactory =
	Factory.define<ReconstructedUserProps>(() => ({
		id: faker.string.nanoid(),
		cognitoSub: faker.string.uuid(), // AWS Coginitoのsub（ユーザー識別子）はUUID v4形式のため
		role: "admin",
	}));

export const newUserPropsFactory = Factory.define<NewUserProps>(() => ({
	cognitoSub: faker.string.uuid(),
	role: "admin",
}));
