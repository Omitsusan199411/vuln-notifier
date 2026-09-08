export interface ReconstructedUserLlmTokenUsageProps {
	readonly id: string;
	readonly userId: string;
	year: number;
	month: number;
	readonly modelId: string;
	inputTokens: number;
	outputTokens: number;
}

export interface NewUserLlmTokenUsageProps {
	readonly userId: string;
	year: number;
	month: number;
	readonly modelId: string;
	inputTokens: number;
	outputTokens: number;
}
