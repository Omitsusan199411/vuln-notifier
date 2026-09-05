export type Role = "admin" | "general";

export interface ReconstructedUserProps {
	readonly id: string;
	cognitoSub: string;
	role: Role;
}

export interface NewUserProps {
	cognitoSub: string;
	role: Role;
}
