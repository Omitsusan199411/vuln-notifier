import type {
	NewUserProps,
	ReconstructedUserProps,
} from "@/domain/user/entity.type.js";

export class User {
	private readonly _id: string | undefined;
	private _cognitoSub: string;

	private constructor(props: ReconstructedUserProps | NewUserProps) {
		this._id = "id" in props ? props.id : undefined;
		this._cognitoSub = props.cognitoSub;
	}

	get id(): string | undefined {
		return this._id;
	}

	get cognitoSub(): string {
		return this._cognitoSub;
	}

	static create(props: NewUserProps) {
		return new User(props);
	}

	static reconstruct(props: ReconstructedUserProps) {
		return new User(props);
	}
}
