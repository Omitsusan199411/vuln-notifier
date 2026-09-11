import { LlmModel } from "@/domain/llm-model/entity.js";
import type {
	LlmModel as LlmModelRecord,
	Prisma,
} from "@/generated/prisma/client.js";

export class PrismaLlmModelMapper {
	static toDomain(record: LlmModelRecord): LlmModel {
		const { id, name, enabled } = record;
		return LlmModel.reconstruct({
			id,
			name,
			enabled,
		});
	}

	static toCreatePersistence(llmModel: LlmModel): Prisma.LlmModelCreateInput {
		const { name, enabled } = llmModel;
		return {
			name,
			enabled,
		};
	}
}
