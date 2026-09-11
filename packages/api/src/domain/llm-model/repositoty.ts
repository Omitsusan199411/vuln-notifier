import type { LlmModel } from "@/domain/llm-model/entity.js";

export interface LlmModelRepository {
	findById(llmModelId: string): Promise<LlmModel | null>;
}
