import type {
	NewUserLlmTokenUsageProps,
	ReconstructedUserLlmTokenUsageProps,
} from "@/domain/user-llm-token-usage/entity.type.js";

export class UserLlmTokenUsage {
	private readonly _id: string | undefined;
	private _userId: string;
	private _year: number;
	private _month: number;
	private _modelId: string;
	private _inputTokens: number;
	private _outputTokens: number;

	private constructor(
		props: ReconstructedUserLlmTokenUsageProps | NewUserLlmTokenUsageProps,
	) {
		this._id = "id" in props ? props.id : undefined;
		this._userId = props.userId;
		this._year = props.year;
		this._month = props.month;
		this._modelId = props.modelId;
		this._inputTokens = props.inputTokens;
		this._outputTokens = props.outputTokens;
	}

	get id(): string | undefined {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get year(): number {
		return this._year;
	}

	get month(): number {
		return this._month;
	}

	get modelId(): string {
		return this._modelId;
	}

	get inputTokens(): number {
		return this._inputTokens;
	}

	get outputTokens(): number {
		return this._outputTokens;
	}

	static create(props: NewUserLlmTokenUsageProps) {
		return new UserLlmTokenUsage(props);
	}

	static reconstruct(props: ReconstructedUserLlmTokenUsageProps) {
		return new UserLlmTokenUsage(props);
	}
}
