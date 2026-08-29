import { Ecosystem } from "@/domain/ecosystem/entity.js";
import type { EcosystemName } from "@/domain/ecosystem/entity.type.js";
import type { EcosystemRepository } from "@/domain/ecosystem/repository.js";
import { PrismaEcosystemMapper } from "@/infrastructure/prisma/ecosystem/mapper.js";
import prisma from "@/lib/prisma.js";

export class PrismaEcosystemRepository implements EcosystemRepository {
	async findByName(ecosystemName: EcosystemName): Promise<Ecosystem | null> {
		const ecosystem = await prisma.ecosystem.findUnique({
			where: {
				name: ecosystemName,
			},
		});
		if (!ecosystem) return null;
		return PrismaEcosystemMapper.toDomain(ecosystem);
	}

	async fetchList(): Promise<Ecosystem[]> {
		const ecosystems = await prisma.ecosystem.findMany();

		if (!ecosystems.length) return [];
		return ecosystems.map((ecosystem) => {
			return Ecosystem.reconstruct(ecosystem);
		});
	}
}
