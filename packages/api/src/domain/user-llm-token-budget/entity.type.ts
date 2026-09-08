export interface ReconstructedUserLlmTokenBudgetProps {
	readonly id: string;
	userId: string;
	monthlyTokenBudget: number;
}

export interface NewUserLlmTokenBudgetProps {
	userId: string;
	monthlyTokenBudget: number;
}
