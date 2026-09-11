import type { LlmModel } from "@/domain/llm-model/entity.js";
import type { LlmModelRepository } from "@/domain/llm-model/repositoty.js";
import { PrismaLlmModelMapper } from "@/infrastructure/prisma/llm-model/mapper.js";
import prisma from "@/lib/prisma.js";

export class PrismaLlmModelRepository implements LlmModelRepository {
	async findById(llmModelId: string): Promise<LlmModel | null> {
		const llmModel = await prisma.llmModel.findUnique({
			where: {
				id: llmModelId,
			},
		});
		if (!llmModel) return null;
		return PrismaLlmModelMapper.toDomain(llmModel);
	}
}
