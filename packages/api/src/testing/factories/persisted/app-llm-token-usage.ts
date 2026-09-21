import { Factory } from "fishery";
import { AppLlmTokenUsage } from "@/domain/app-llm-token-usage/entity.js";
import type { NewAppLlmTokenUsageProps } from "@/domain/app-llm-token-usage/entity.type.js";
import type { AppLlmTokenUsage as AppLlmTokenUsageRecord } from "@/generated/prisma/client.js";
import { PrismaAppLlmTokenUsageMapper } from "@/infrastructure/prisma/app-llm-token-usage/mapper.js";
import prisma from "@/lib/prisma.js";
import { llmModelFactory } from "@/testing/factories/persisted/llm-model.js";
import { newAppLlmTokenUsagePropsFactory } from "../app-llm-token-usage.js";

export const appLlmTokenUsageFactory = Factory.define<
	NewAppLlmTokenUsageProps,
	unknown,
	AppLlmTokenUsageRecord
>(({ onCreate, params }) => {
	onCreate(async (appLlmTokenUsage) => {
		const modelId =
			params.modelId !== undefined
				? params.modelId
				: (await llmModelFactory.create()).id;

		const data = PrismaAppLlmTokenUsageMapper.toCreatePersistence(
			AppLlmTokenUsage.create({
				...appLlmTokenUsage,
				modelId,
			}),
		);

		return await prisma.appLlmTokenUsage.create({ data });
	});
	return newAppLlmTokenUsagePropsFactory.build();
});
