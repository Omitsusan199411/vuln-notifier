import type {
	NewUserLlmTokenBudgetProps,
	ReconstructedUserLlmTokenBudgetProps,
} from "@/domain/user-llm-token-budget/entity.type.js";

export class UserLlmTokenBudget {
	private readonly _id: string | undefined;
	private _userId: string;
	private _monthlyTokenBudget: number;

	private constructor(
		props: ReconstructedUserLlmTokenBudgetProps | NewUserLlmTokenBudgetProps,
	) {
		this._id = "id" in props ? props.id : undefined;
		this._userId = props.userId;
		this._monthlyTokenBudget = props.monthlyTokenBudget;
	}

	get id(): string | undefined {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get monthlyTokenBudget(): number {
		return this._monthlyTokenBudget;
	}

	static create(props: NewUserLlmTokenBudgetProps) {
		return new UserLlmTokenBudget(props);
	}

	static reconstruct(props: ReconstructedUserLlmTokenBudgetProps) {
		return new UserLlmTokenBudget(props);
	}
}
