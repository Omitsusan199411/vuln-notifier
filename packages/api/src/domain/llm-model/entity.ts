import type {
	NewLlmModelProps,
	ReconstructedLlmModelProps,
} from "@/domain/llm-model/entity.type.js";

export class LlmModel {
	private readonly _id: string | undefined;
	private _name: string;
	private _enabled: boolean;

	private constructor(props: NewLlmModelProps | ReconstructedLlmModelProps) {
		this._id = "id" in props ? props.id : undefined;
		this._name = props.name;
		this._enabled = props.enabled;
	}

	get id(): string | undefined {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get enabled(): boolean {
		return this._enabled;
	}

	static create(props: NewLlmModelProps) {
		return new LlmModel(props);
	}

	static reconstruct(props: ReconstructedLlmModelProps) {
		return new LlmModel(props);
	}
}
