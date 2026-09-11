import { Factory } from "fishery";
import { LlmModel } from "@/domain/llm-model/entity.js";
import type { NewLlmModelProps } from "@/domain/llm-model/entity.type.js";
import type { LlmModel as LlmModelRecord } from "@/generated/prisma/client.js";
import { PrismaLlmModelMapper } from "@/infrastructure/prisma/llm-model/mapper.js";
import prisma from "@/lib/prisma.js";
import { newLlmModelPropsFactory } from "../llm-model.js";

export const llmModelFactory = Factory.define<
	NewLlmModelProps,
	unknown,
	LlmModelRecord
>(({ onCreate }) => {
	onCreate(async (llmModel) => {
		const data = PrismaLlmModelMapper.toCreatePersistence(
			LlmModel.create(llmModel),
		);

		return await prisma.llmModel.create({
			data,
		});
	});

	return newLlmModelPropsFactory.build();
});
