import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	NewLlmModelProps,
	ReconstructedLlmModelProps,
} from "@/domain/llm-model/entity.type.js";

export const reconstructedLlmModelPropsFactory =
	Factory.define<ReconstructedLlmModelProps>(() => ({
		id: faker.string.nanoid(),
		name: faker.lorem.word(),
		enabled: faker.datatype.boolean(),
	}));

export const newLlmModelPropsFactory = Factory.define<NewLlmModelProps>(() => ({
	name: faker.lorem.word(),
	enabled: faker.datatype.boolean(),
}));
