export type EcosystemName =
	| "rubygems"
	| "npm"
	| "pip"
	| "maven"
	| "nuget"
	| "composer"
	| "go"
	| "rust"
	| "erlang"
	| "actions"
	| "pub"
	| "swift"
	| "other";

export interface ReconstructedEcosystemProps {
	readonly id: string;
	readonly name: EcosystemName;
}
