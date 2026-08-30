export interface ReconstructedUserProps {
	readonly id: string;
	cognitoSub: string;
}

export interface NewUserProps {
	cognitoSub: string;
}
