export interface ReconstructedAppLlmTokenUsageProps {
	readonly id: string;
	year: number;
	month: number;
	readonly modelId: string;
	inputTokens: number;
	outputTokens: number;
}

export interface NewAppLlmTokenUsageProps {
	year: number;
	month: number;
	readonly modelId: string;
	inputTokens: number;
	outputTokens: number;
}
