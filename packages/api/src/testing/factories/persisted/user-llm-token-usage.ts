import { Factory } from "fishery";
import { UserLlmTokenUsage } from "@/domain/user-llm-token-usage/entity.js";
import type { NewUserLlmTokenUsageProps } from "@/domain/user-llm-token-usage/entity.type.js";
import type { UserLlmTokenUsage as UserLlmTokenUsageRecord } from "@/generated/prisma/client.js";
import { PrismaUserLlmTokenUsageMapper } from "@/infrastructure/prisma/user-llm-token-usage/mapper.js";
import prisma from "@/lib/prisma.js";
import { newUserLlmTokenUsagePropsFactory } from "@/testing/factories/user-llm-token-usage.js";
import { llmModelFactory } from "./llm-model.js";
import { userFactory } from "./user.js";

export const userLlmTokenUsageFactory = Factory.define<
	NewUserLlmTokenUsageProps,
	unknown,
	UserLlmTokenUsageRecord
>(({ onCreate, params }) => {
	onCreate(async (userLlmTokenUsage) => {
		const userId =
			params.userId !== undefined
				? params.userId
				: (await userFactory.create()).id;
		const modelId =
			params.modelId !== undefined
				? params.modelId
				: (await llmModelFactory.create()).id;

		const data = PrismaUserLlmTokenUsageMapper.toCreatePersistence(
			UserLlmTokenUsage.create({
				...userLlmTokenUsage,
				userId,
				modelId,
			}),
		);

		return await prisma.userLlmTokenUsage.create({ data });
	});
	return newUserLlmTokenUsagePropsFactory.build();
});
