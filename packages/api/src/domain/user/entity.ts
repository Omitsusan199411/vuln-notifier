import type {
	NewUserProps,
	ReconstructedUserProps,
	Role,
} from "@/domain/user/entity.type.js";

export class User {
	private readonly _id: string | undefined;
	private _cognitoSub: string;
	private _role: Role;

	private constructor(props: ReconstructedUserProps | NewUserProps) {
		this._id = "id" in props ? props.id : undefined;
		this._cognitoSub = props.cognitoSub;
		this._role = props.role;
	}

	get id(): string | undefined {
		return this._id;
	}

	get cognitoSub(): string {
		return this._cognitoSub;
	}

	get role(): Role {
		return this._role;
	}

	static create(props: NewUserProps) {
		return new User(props);
	}

	static reconstruct(props: ReconstructedUserProps) {
		return new User(props);
	}

	isAdmin(): boolean {
		return this._role === "admin";
	}
}
