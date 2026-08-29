import { Ecosystem } from "@/domain/ecosystem/entity.js";
import type { ReconstructedEcosystemProps } from "@/domain/ecosystem/entity.type.js";

export class PrismaEcosystemMapper {
	static toDomain(record: ReconstructedEcosystemProps): Ecosystem {
		return Ecosystem.reconstruct(record);
	}
}
