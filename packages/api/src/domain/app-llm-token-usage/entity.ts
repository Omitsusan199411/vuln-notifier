import type {
	NewAppLlmTokenUsageProps,
	ReconstructedAppLlmTokenUsageProps,
} from "@/domain/app-llm-token-usage/entity.type.js";

export class AppLlmTokenUsage {
	private readonly _id: string | undefined;
	private _year: number;
	private _month: number;
	private _modelId: string;
	private _inputTokens: number;
	private _outputTokens: number;

	private constructor(
		props: ReconstructedAppLlmTokenUsageProps | NewAppLlmTokenUsageProps,
	) {
		this._id = "id" in props ? props.id : undefined;
		this._year = props.year;
		this._month = props.month;
		this._modelId = props.modelId;
		this._inputTokens = props.inputTokens;
		this._outputTokens = props.outputTokens;
	}

	get id(): string | undefined {
		return this._id;
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

	static create(props: NewAppLlmTokenUsageProps) {
		return new AppLlmTokenUsage(props);
	}

	static reconstruct(props: ReconstructedAppLlmTokenUsageProps) {
		return new AppLlmTokenUsage(props);
	}
}
