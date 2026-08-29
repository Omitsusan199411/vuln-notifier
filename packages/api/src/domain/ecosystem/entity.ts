import type {
	EcosystemName,
	ReconstructedEcosystemProps,
} from "@/domain/ecosystem/entity.type.js";

export class Ecosystem {
	private readonly _id: string;
	private readonly _name: EcosystemName;

	private constructor(props: ReconstructedEcosystemProps) {
		this._id = props.id;
		this._name = props.name;
	}

	get id(): string {
		return this._id;
	}

	get name(): EcosystemName {
		return this._name;
	}

	// Entityの再構築
	static reconstruct(props: ReconstructedEcosystemProps) {
		return new Ecosystem(props);
	}
}
