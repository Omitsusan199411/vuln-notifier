import type { Ecosystem } from "@/domain/ecosystem/entity.js";
import type { EcosystemName } from "@/domain/ecosystem/entity.type.js";

export interface EcosystemRepository {
	findByName(ecosystemName: EcosystemName): Promise<Ecosystem | null>;

	fetchList(): Promise<Ecosystem[]>;
}
